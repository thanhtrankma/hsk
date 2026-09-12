import * as cheerio from "cheerio";

export type RadicalCard = {
  href: string;
  han: string;
  name: string;
  meaning: string;
  stats: string;
};

export type RadicalsIndexData = {
  before: string;
  statsSection: string;
  faqSection: string;
  categoryCounts: { label: string; count: number }[];
  radicals: RadicalCard[];
};

// The "Phân nhóm" (category) filter buttons on this page have never had a
// working click handler in this clone (a plain HTTP scrape can't capture
// client-side state) -- but the scraped radical grid turns out to already
// list all 214 radicals ordered in contiguous category blocks matching the
// counts shown on each button, so no extra data capture is needed: slicing
// the list by those counts, in order, reconstructs the exact grouping.
export function parseRadicalsIndexHtml(html: string): RadicalsIndexData | null {
  const $ = cheerio.load(html);
  const root = $("main > div").first();
  const children = root.children();
  if (children.length < 5) return null;

  const before = $.html(children.eq(0)) + $.html(children.eq(1));
  const statsSection = $.html(children.eq(3));
  const faqSection = $.html(children.eq(4));

  const filterRoot = children.eq(2);
  const categoryButtons = filterRoot.find("aside p.mb-3").first().nextAll("div").first().find("button");
  const categoryCounts = categoryButtons
    .map((_, el) => {
      const $el = $(el);
      const label = $el.find("p").first().text().trim();
      const countText = $el.find("p").eq(1).text().trim();
      const count = parseInt(countText, 10);
      return { label, count: Number.isNaN(count) ? 0 : count };
    })
    .get();

  const radicals = filterRoot
    .find('a[href^="/radicals/"]')
    .map((_, el) => {
      const $el = $(el);
      const paras = $el.find("p");
      return {
        href: $el.attr("href") || "",
        han: paras.eq(0).text().trim(),
        name: paras.eq(1).text().trim(),
        meaning: paras.eq(2).text().trim(),
        stats: paras.eq(3).text().trim(),
      };
    })
    .get();

  if (radicals.length === 0 || categoryCounts.length === 0) return null;

  return { before, statsSection, faqSection, categoryCounts, radicals };
}
