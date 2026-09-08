#!/usr/bin/env python3
"""Generic full-site crawler for hanbeego.com.

Crawls every URL reachable from the sitemap (falling back to a same-domain
link crawl), extracts a generic content model (title, description, headings,
sanitized main-content HTML, internal links) from each page, downloads the
images referenced in that content, and writes everything out as JSON so a
front-end (e.g. the Next.js clone in ../web) can render every page from data.

Usage:
    python scraper.py --base-url https://hanbeego.com \
        --content-dir ../web/content \
        --assets-dir ../web/public/scraped-assets \
        --workers 8 --delay 0.3

Run `python scraper.py --help` for all options.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import logging
import re
import sys
import time
import urllib.robotparser as robotparser
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from pathlib import Path
from threading import Lock
from typing import Optional
from urllib.parse import urljoin, urlparse, urldefrag
from xml.etree import ElementTree

import requests
from bs4 import BeautifulSoup, Tag
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

try:
    from tqdm import tqdm
except ImportError:  # tqdm is optional, fall back to plain logging
    tqdm = None

LOG = logging.getLogger("hskgo-scraper")

DEFAULT_UA = (
    "HSKGoSiteCloneBot/1.0 (+owner-authorized full-site export; "
    "contact: info@hanbeego.com)"
)
MAIN_CONTENT_SELECTORS = ["#main-content", "main", "article", "body"]


@dataclass
class PageResult:
    url: str
    path: str
    ok: bool
    reason: str = ""


@dataclass
class CrawlStats:
    lock: Lock = field(default_factory=Lock)
    fetched: int = 0
    saved: int = 0
    failed: list = field(default_factory=list)
    skipped: list = field(default_factory=list)

    def record_ok(self):
        with self.lock:
            self.fetched += 1
            self.saved += 1

    def record_fail(self, url: str, reason: str):
        with self.lock:
            self.fetched += 1
            self.failed.append({"url": url, "reason": reason})

    def record_skip(self, url: str, reason: str):
        with self.lock:
            self.skipped.append({"url": url, "reason": reason})


def build_session(user_agent: str) -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=0.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    adapter = HTTPAdapter(max_retries=retry, pool_maxsize=32)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    session.headers.update({"User-Agent": user_agent, "Accept-Language": "vi,en;q=0.8"})
    return session


def load_robots(base_url: str, session: requests.Session) -> robotparser.RobotFileParser:
    rp = robotparser.RobotFileParser()
    robots_url = urljoin(base_url, "/robots.txt")
    try:
        resp = session.get(robots_url, timeout=10)
        if resp.status_code == 200:
            rp.parse(resp.text.splitlines())
        else:
            rp.parse([])
    except requests.RequestException:
        rp.parse([])
    return rp


def discover_sitemap_urls(base_url: str, session: requests.Session) -> list[str]:
    """Collect every <loc> from sitemap.xml, following nested sitemap indexes."""
    to_visit = [urljoin(base_url, "/sitemap.xml")]
    seen_sitemaps: set[str] = set()
    urls: set[str] = set()

    while to_visit:
        sitemap_url = to_visit.pop()
        if sitemap_url in seen_sitemaps:
            continue
        seen_sitemaps.add(sitemap_url)
        try:
            resp = session.get(sitemap_url, timeout=15)
            resp.raise_for_status()
            root = ElementTree.fromstring(resp.content)
        except (requests.RequestException, ElementTree.ParseError) as exc:
            LOG.warning("Could not read sitemap %s: %s", sitemap_url, exc)
            continue

        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        # sitemap index -> nested sitemaps
        for sm in root.findall(".//sm:sitemap/sm:loc", ns):
            if sm.text:
                to_visit.append(sm.text.strip())
        # urlset -> page urls
        for loc in root.findall(".//sm:url/sm:loc", ns):
            if loc.text:
                urls.add(loc.text.strip())

    return sorted(urls)


def same_domain(url: str, domain: str) -> bool:
    return urlparse(url).netloc == domain


def normalize_url(url: str) -> str:
    url, _ = urldefrag(url)
    if url.endswith("/") and urlparse(url).path != "/":
        url = url[:-1]
    return url


def path_for_url(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path or "/"
    return path


def content_file_for_path(path: str, content_dir: Path) -> Path:
    if path == "/":
        return content_dir / "_index.json"
    clean = path.strip("/")
    return content_dir / f"{clean}.json"


class AssetDownloader:
    """Downloads and dedupes images referenced by scraped pages."""

    def __init__(self, session: requests.Session, assets_dir: Path, url_prefix: str):
        self.session = session
        self.assets_dir = assets_dir
        self.url_prefix = url_prefix.rstrip("/")
        self._cache: dict[str, str] = {}
        self._lock = Lock()
        self.assets_dir.mkdir(parents=True, exist_ok=True)

    def fetch(self, absolute_url: str) -> Optional[str]:
        with self._lock:
            cached = self._cache.get(absolute_url)
            if cached:
                return cached

        parsed = urlparse(absolute_url)
        suffix = Path(parsed.path).suffix or ".bin"
        digest = hashlib.sha1(absolute_url.encode("utf-8")).hexdigest()[:20]
        filename = f"{digest}{suffix}"
        dest = self.assets_dir / filename
        rel_url = f"{self.url_prefix}/{filename}"

        if not dest.exists():
            try:
                resp = self.session.get(absolute_url, timeout=20)
                resp.raise_for_status()
                dest.write_bytes(resp.content)
            except requests.RequestException as exc:
                LOG.debug("Asset download failed %s: %s", absolute_url, exc)
                return None

        with self._lock:
            self._cache[absolute_url] = rel_url
        return rel_url


def sanitize_main_content(main: Tag, base_url: str, domain: str, assets: AssetDownloader) -> tuple[str, list[dict]]:
    for tag in main.select("script, style, noscript, iframe"):
        tag.decompose()

    internal_links: list[dict] = []
    for a in main.find_all("a", href=True):
        href = urljoin(base_url, a["href"])
        if same_domain(href, domain):
            a["href"] = path_for_url(normalize_url(href)) or "/"
            text = a.get_text(strip=True)
            if text:
                internal_links.append({"href": a["href"], "text": text})
        else:
            a["href"] = href
            a["rel"] = "noopener noreferrer"
            a["target"] = "_blank"

    for img in main.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if not src:
            continue
        absolute = urljoin(base_url, src)
        local = assets.fetch(absolute)
        if local:
            img["src"] = local
        if img.has_attr("srcset"):
            del img["srcset"]
        img["loading"] = "lazy"

    return str(main), internal_links


def extract_page(url: str, html: str, domain: str, assets: AssetDownloader) -> dict:
    soup = BeautifulSoup(html, "lxml")

    title = ""
    if soup.title and soup.title.string:
        title = soup.title.string.strip()
    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        title = title or og_title["content"].strip()

    description = ""
    desc_tag = soup.find("meta", attrs={"name": "description"})
    if desc_tag and desc_tag.get("content"):
        description = desc_tag["content"].strip()

    canonical = ""
    canon_tag = soup.find("link", rel="canonical")
    if canon_tag and canon_tag.get("href"):
        canonical = canon_tag["href"].strip()

    html_tag = soup.find("html")
    lang = html_tag.get("lang", "vi") if html_tag else "vi"

    main = None
    for selector in MAIN_CONTENT_SELECTORS:
        main = soup.select_one(selector)
        if main:
            break
    if main is None:
        main = soup

    headings = [
        {"level": h.name, "text": h.get_text(strip=True)}
        for h in main.find_all(["h1", "h2", "h3"])
        if h.get_text(strip=True)
    ]

    main_html, internal_links = sanitize_main_content(main, url, domain, assets)

    path = path_for_url(url)
    segments = [s for s in path.strip("/").split("/") if s]
    section = segments[0] if segments else "home"

    return {
        "url": url,
        "path": path or "/",
        "section": section,
        "title": title,
        "description": description,
        "canonical": canonical,
        "lang": lang,
        "headings": headings,
        "main_html": main_html,
        "internal_links": internal_links[:60],
        "scraped_at": int(time.time()),
    }


def crawl_links_for_discovery(html: str, base_url: str, domain: str) -> set[str]:
    soup = BeautifulSoup(html, "lxml")
    found = set()
    for a in soup.find_all("a", href=True):
        absolute = urljoin(base_url, a["href"])
        absolute = normalize_url(absolute)
        if not same_domain(absolute, domain) or not absolute.startswith(("http://", "https://")):
            continue
        if "?" in absolute:
            # query-string links are almost always widgets/lookups (e.g. the
            # dictionary tool), not distinct content pages worth crawling
            continue
        found.add(absolute)
    return found


class Crawler:
    def __init__(self, args: argparse.Namespace):
        self.args = args
        self.base_url = args.base_url.rstrip("/")
        self.domain = urlparse(self.base_url).netloc
        self.session = build_session(args.user_agent)
        self.robots = load_robots(self.base_url, self.session)
        self.content_dir = Path(args.content_dir)
        self.html_dir = Path(args.html_dir) if args.save_html else None
        self.assets = AssetDownloader(self.session, Path(args.assets_dir), args.asset_url_prefix)
        self.stats = CrawlStats()
        self.exclude_re = re.compile(args.exclude) if args.exclude else None
        self.include_re = re.compile(args.include) if args.include else None
        self.manifest_lock = Lock()
        self.manifest: list[dict] = []
        self.visited: set[str] = set()
        self.visited_lock = Lock()

    def allowed(self, url: str) -> bool:
        if not self.robots.can_fetch(self.args.user_agent, url):
            return False
        path = path_for_url(url)
        if self.include_re and not self.include_re.search(path):
            return False
        if self.exclude_re and self.exclude_re.search(path):
            return False
        return True

    def seed_urls(self) -> list[str]:
        urls = set()
        if not self.args.no_sitemap:
            LOG.info("Reading sitemap.xml ...")
            urls.update(discover_sitemap_urls(self.base_url, self.session))
            LOG.info("Sitemap yielded %d URLs", len(urls))
        urls.add(self.base_url + "/")
        for seed in self.args.seed:
            urls.add(normalize_url(urljoin(self.base_url, seed)))
        return sorted(normalize_url(u) for u in urls)

    def fetch_one(self, url: str) -> tuple[Optional[str], set[str]]:
        try:
            resp = self.session.get(url, timeout=20)
        except requests.RequestException as exc:
            self.stats.record_fail(url, f"request-error: {exc}")
            return None, set()

        if resp.status_code != 200:
            self.stats.record_fail(url, f"http-{resp.status_code}")
            return None, set()

        content_type = resp.headers.get("Content-Type", "")
        if "text/html" not in content_type:
            self.stats.record_skip(url, f"non-html:{content_type}")
            return None, set()

        discovered = set()
        if self.args.follow_links:
            discovered = crawl_links_for_discovery(resp.text, url, self.domain)

        return resp.text, discovered

    def process(self, url: str):
        html_content, discovered = self.fetch_one(url)
        if html_content is None:
            return discovered

        if self.html_dir:
            path = path_for_url(url)
            out = self.html_dir / (path.strip("/") or "index")
            out = out.with_suffix(".html") if out.suffix != ".html" else out
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(html_content, encoding="utf-8")

        try:
            data = extract_page(url, html_content, self.domain, self.assets)
        except Exception as exc:  # keep crawling even if one page is malformed
            self.stats.record_fail(url, f"parse-error: {exc}")
            return discovered

        dest = content_file_for_path(data["path"], self.content_dir)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

        with self.manifest_lock:
            self.manifest.append(
                {
                    "path": data["path"],
                    "section": data["section"],
                    "title": data["title"],
                    "description": data["description"],
                }
            )
        self.stats.record_ok()
        return discovered

    def run(self):
        self.content_dir.mkdir(parents=True, exist_ok=True)
        if self.html_dir:
            self.html_dir.mkdir(parents=True, exist_ok=True)

        queue = [u for u in self.seed_urls() if self.allowed(u)]
        with self.visited_lock:
            for u in queue:
                self.visited.add(u)

        if self.args.limit:
            queue = queue[: self.args.limit]

        progress = tqdm(total=len(queue), unit="page") if tqdm else None
        delay = self.args.delay

        with ThreadPoolExecutor(max_workers=self.args.workers) as pool:
            while queue:
                futures = {}
                for url in queue:
                    futures[pool.submit(self._process_with_delay, url, delay)] = url

                queue = []
                for future in as_completed(futures):
                    url = futures[future]
                    try:
                        discovered = future.result() or set()
                    except Exception as exc:  # pragma: no cover - safety net
                        LOG.error("Unhandled error for %s: %s", url, exc)
                        discovered = set()

                    if progress:
                        progress.update(1)
                    else:
                        LOG.info("[%d/%d ok] %s", self.stats.saved, self.stats.fetched, url)

                    if self.args.follow_links:
                        with self.visited_lock:
                            for link in discovered:
                                if (
                                    link not in self.visited
                                    and self.allowed(link)
                                    and (not self.args.limit or self.stats.fetched < self.args.limit)
                                ):
                                    self.visited.add(link)
                                    queue.append(link)
                        if progress and queue:
                            progress.total += len(queue)
                            progress.refresh()

        if progress:
            progress.close()

        self.write_manifest()
        self.write_report()

    def _process_with_delay(self, url: str, delay: float):
        result = self.process(url)
        if delay:
            time.sleep(delay)
        return result

    def write_manifest(self):
        manifest_path = self.content_dir / "manifest.json"
        merged: dict[str, dict] = {}
        if manifest_path.exists():
            try:
                for entry in json.loads(manifest_path.read_text(encoding="utf-8")):
                    merged[entry["path"]] = entry
            except (json.JSONDecodeError, KeyError):
                pass
        for entry in self.manifest:
            merged[entry["path"]] = entry
        ordered = [merged[k] for k in sorted(merged)]
        manifest_path.write_text(json.dumps(ordered, ensure_ascii=False, indent=2), encoding="utf-8")
        LOG.info("Wrote manifest with %d pages (this run: %d) -> %s", len(ordered), len(self.manifest), manifest_path)

    def write_report(self):
        report = {
            "base_url": self.base_url,
            "fetched": self.stats.fetched,
            "saved": self.stats.saved,
            "failed": self.stats.failed,
            "skipped": self.stats.skipped,
        }
        report_path = self.content_dir / "report.json"
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        LOG.info(
            "Done. saved=%d failed=%d skipped=%d (report: %s)",
            self.stats.saved,
            len(self.stats.failed),
            len(self.stats.skipped),
            report_path,
        )


def parse_args(argv=None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base-url", default="https://hanbeego.com", help="Site root to crawl")
    parser.add_argument("--content-dir", default="./output/content", help="Where per-page JSON is written")
    parser.add_argument("--assets-dir", default="./output/assets", help="Where downloaded images are written")
    parser.add_argument(
        "--asset-url-prefix",
        default="/scraped-assets",
        help="URL prefix baked into saved HTML for downloaded images "
        "(should match how the Next.js app serves --assets-dir)",
    )
    parser.add_argument("--save-html", action="store_true", help="Also save the raw HTML per page")
    parser.add_argument("--html-dir", default="./output/html", help="Where raw HTML is written if --save-html")
    parser.add_argument("--workers", type=int, default=8, help="Concurrent request workers")
    parser.add_argument("--delay", type=float, default=0.25, help="Seconds to sleep after each request, per worker")
    parser.add_argument("--limit", type=int, default=0, help="Stop after N pages (0 = no limit), useful for testing")
    parser.add_argument("--no-sitemap", action="store_true", help="Skip sitemap.xml and rely on link crawling only")
    parser.add_argument(
        "--follow-links",
        action="store_true",
        default=False,
        help="Also discover pages by following internal links, in addition to "
        "the sitemap (off by default - hanbeego's sitemap already lists every "
        "public page; link-following can wander into widgets/utility routes)",
    )
    parser.add_argument("--seed", action="append", default=[], help="Extra path(s) to seed the crawl with")
    parser.add_argument("--include", default="", help="Regex: only crawl paths matching this")
    parser.add_argument("--exclude", default="", help="Regex: skip paths matching this")
    parser.add_argument("--user-agent", default=DEFAULT_UA)
    parser.add_argument("-v", "--verbose", action="store_true")
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )
    crawler = Crawler(args)
    crawler.run()
    return 0 if not crawler.stats.failed else 1


if __name__ == "__main__":
    sys.exit(main())
