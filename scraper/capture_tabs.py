"""One-off helper: hanbeego.com/pronunciation renders its 4 pronunciation
tabs client-side (React) -- only the initially-active tab's HTML ends up in
the DOM, so the static scraper (which does a plain HTTP GET) only ever
captures that one tab. This script drives a real headless browser, clicks
through the other 3 tabs, and saves each tab's panel HTML plus the
surrounding static sections to disk, so they can be spliced into a real
interactive tabs component. Output never passes through an LLM context --
written directly to disk by this script, same as the main scraper's own
HTTP-fetch-and-write flow.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = "https://hanbeego.com/pronunciation"
TABS = ["4 thanh điệu", "Phụ âm đầu", "Vần", "Biến điệu"]
OUT = Path(__file__).parent / "pronunciation_tabs.json"

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto(URL, wait_until="networkidle")

    try:
        page.get_by_text("Tiếng Việt", exact=True).click(timeout=5000)
        page.wait_for_timeout(500)
    except Exception:
        pass

    # Structural split: root container's children are
    # [headerDiv, tabsWrapperDiv(mt-10), ...restSections]. Grab header +
    # rest separately from the tab panels so we can rebuild the page as
    # static-header + interactive-tabs + static-rest.
    root_js = """
    () => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '4 thanh điệu');
      let tabsWrapper = btn.closest('[class*="inline-flex"]').parentElement;
      const root = tabsWrapper.parentElement;
      const children = [...root.children];
      const idx = children.indexOf(tabsWrapper);
      const before = children.slice(0, idx).map(c => c.outerHTML).join('');
      const after = children.slice(idx + 1).map(c => c.outerHTML).join('');
      return { rootClass: root.className, before, after };
    }
    """
    structure = page.evaluate(root_js)

    result = {"before": structure["before"], "after": structure["after"], "rootClass": structure["rootClass"], "tabs": {}}
    for label in TABS:
        btn = page.get_by_role("button", name=label, exact=True)
        btn.click()
        page.wait_for_timeout(400)
        tab_bar = page.locator('[class*="inline-flex"]:has(button:text-is("4 thanh điệu"))').first
        panel_html = tab_bar.evaluate("el => el.nextElementSibling ? el.nextElementSibling.innerHTML : null")
        result["tabs"][label] = panel_html
        print(f"{label}: captured {len(panel_html) if panel_html else 0} chars")

    browser.close()

OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"before: {len(structure['before'])} chars, after: {len(structure['after'])} chars")
print(f"Wrote {OUT}")
