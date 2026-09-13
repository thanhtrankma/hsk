"""One-off helper: downloads pronunciation audio + its pedagogical grouping
from cge.edu.vn's /phat-am/ pages (per explicit request/confirmation from
the site's owner) into this project, for use in the /pronunciation feature.
Uses a headless browser to find each <audio> element, its nearest preceding
section heading (e.g. "Nhóm thanh mẫu 2: ...", "Quy tắc 3: ..."), and its
table row's cell text, then downloads the actual mp3 bytes via plain HTTP --
straight to disk, never through an LLM context, same as the rest of this
project's scraping tools.
"""
import json
import re
import unicodedata
from pathlib import Path
from urllib.request import urlopen, Request

from playwright.sync_api import sync_playwright

PAGES = {
    "thanh-mau": "https://cge.edu.vn/phat-am/thanh-mau-tieng-trung.html",
    "van-mau": "https://cge.edu.vn/phat-am/van-mau-tieng-trung.html",
    "thanh-dieu": "https://cge.edu.vn/phat-am/thanh-dieu.html",
    "quy-tac-phat-am": "https://cge.edu.vn/phat-am/quy-tac-phat-am-trong-tieng-trung.html",
}

OUT_DIR = Path(__file__).parent.parent / "web" / "public" / "audio" / "cge"
MANIFEST = OUT_DIR / "manifest.json"

EXTRACT_JS = """
() => {
  const all = [...document.querySelectorAll('h1,h2,h3,h4,table')];
  function nearestHeading(table) {
    const idx = all.indexOf(table);
    for (let i = idx - 1; i >= 0; i--) {
      if (/^H[1-4]$/.test(all[i].tagName)) return all[i].textContent.trim();
    }
    return null;
  }
  const results = [];
  for (const table of document.querySelectorAll('table')) {
    const rows = [...table.querySelectorAll('tr')];
    const heading = nearestHeading(table);
    // The first row is a real header only if it has no <audio> of its own
    // (some of the rules page's tiny per-example tables are just one bare
    // data row with no header at all).
    const firstRowHasAudio = rows[0] && !!rows[0].querySelector('audio');
    const headerCells = !firstRowHasAudio && rows.length > 1
      ? [...rows[0].children].map(td => td.textContent.replace(/\\s+/g, ' ').trim())
      : null;
    rows.forEach((tr, i) => {
      if (headerCells && i === 0) return;
      const audio = tr.querySelector('audio');
      if (!audio) return;
      const src = audio.currentSrc || audio.src || (audio.querySelector('source') && audio.querySelector('source').src);
      if (!src) return;
      const cells = [...tr.children].map(td => td.textContent.replace(/\\s+/g, ' ').trim());
      results.push({ heading, cells, headers: headerCells, src });
    });
  }
  return results;
}
"""


def slugify(text: str, fallback: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text[:60] or fallback


def clean_text(text: str) -> str:
    # Source markup sometimes concatenates adjacent inline elements with no
    # whitespace between them (e.g. "Thanh 1Âm bình" for "Thanh 1" + "Âm bình").
    return re.sub(r"(\d)([A-ZÀ-Ỹ])", r"\1 \2", text)


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    manifest = {}

    for category, url in PAGES.items():
        page.goto(url, wait_until="networkidle")
        try:
            page.get_by_text("Tiếng Việt", exact=True).click(timeout=4000)
            page.wait_for_timeout(400)
        except Exception:
            pass

        rows = page.evaluate(EXTRACT_JS)
        cat_dir = OUT_DIR / category
        cat_dir.mkdir(parents=True, exist_ok=True)
        entries = []

        for i, row in enumerate(rows):
            cells = [clean_text(c) for c in row["cells"]]
            label = cells[0] if cells else f"item-{i}"
            slug = slugify(label, f"item-{i}")
            src = row["src"]
            ext = src.split(".")[-1].split("?")[0][:4] or "mp3"
            filename = f"{i:03d}-{slug}.{ext}"
            dest = cat_dir / filename

            req = Request(src, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(req, timeout=30) as resp, open(dest, "wb") as f:
                f.write(resp.read())

            entries.append({
                "group": clean_text(row["heading"]) if row["heading"] else row["heading"],
                "label": label,
                "cells": cells,
                "headers": row["headers"],
                "file": f"{category}/{filename}",
            })

        manifest[category] = entries
        print(f"{category}: downloaded {len(entries)} audio files across {len(set(e['group'] for e in entries))} groups")

    browser.close()

MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {MANIFEST}")
