"""One-off helper: hanbeego.com/radicals groups its 214 Kangxi radicals into
7 semantic categories ("Phân nhóm") via a client-side filter -- a plain HTTP
scrape only ever captures whichever category is active by default, so our
own /radicals page has the filter buttons but no working filter logic.
This drives a headless browser, clicks through each of the 7 categories,
and records the description text + member radical hrefs for each straight
to disk (never through an LLM context), same as this project's other
capture scripts.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = "https://hanbeego.com/radicals"
CATEGORIES = [
    "Con người",
    "Thiên nhiên",
    "Động vật",
    "Hành động",
    "Phương hướng & Địa điểm",
    "Đồ vật",
    "Biểu tượng & Trừu tượng",
]

OUT = Path(__file__).parent.parent / "web" / "content" / "_manual" / "radical-groups.json"

GET_STATE_JS = """
() => {
  // The site leaves stale description paragraphs behind after each
  // transition (same class, same DOM position) instead of replacing them,
  // so the *last* match is the current one -- not the first.
  const matches = [...document.querySelectorAll('h2,h3,p,span')].filter(el => el.textContent.trim().startsWith('Bộ thủ về'));
  const heading = matches[matches.length - 1];
  if (!heading) return null;
  let grid = heading.parentElement.querySelector('[class*="grid"]') || heading.parentElement.parentElement.querySelector('[class*="grid"]');
  const hrefs = grid ? [...grid.querySelectorAll('a[href^="/radicals/"]')].map(a => a.getAttribute('href')) : [];
  return { desc: heading.textContent.trim(), hrefs };
}
"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 1400})
    page.goto(URL, wait_until="networkidle")
    try:
        page.get_by_text("Tiếng Việt", exact=True).click(timeout=4000)
        page.wait_for_timeout(500)
    except Exception:
        pass

    result = {}
    for label in CATEGORIES:
        matches = page.get_by_role("button", name=label, exact=False)
        count = matches.count()
        btn = matches.nth(count - 1)  # last match -- first is a duplicate (mobile?) that doesn't drive the grid
        btn.scroll_into_view_if_needed()
        btn.click(force=True)
        page.wait_for_timeout(600)
        state = page.evaluate(GET_STATE_JS)
        result[label] = state
        print(f"{label}: matches={count} -> {len(state['hrefs']) if state else 0} radicals -- {state['desc'][:50] if state else 'N/A'}")

    browser.close()

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Wrote {OUT}")
