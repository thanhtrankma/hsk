import * as cheerio from "cheerio";

export type RadicalWritingData = {
  title: string;
  description: string;
  breadcrumbHref: string;
  breadcrumbText: string;
  chars: string[];
  radical: { char: string; href: string; name: string; note: string } | null;
  strokeTip: string | null;
};

// The scraped page always had an empty placeholder where the original's
// client-side writing canvas used to render (a plain HTTP scrape can't
// capture that), but everything else -- the character list, the radical
// mnemonic panel, the stroke-order tip -- is static and parses cleanly.
export function parseRadicalWritingHtml(html: string): RadicalWritingData | null {
  const $ = cheerio.load(html);

  const breadcrumbLink = $("nav a").first();
  const chars = $("aside button.han")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  if (chars.length === 0) return null;

  const radicalLink = $("a.group").first();
  const radical = radicalLink.length
    ? {
        char: radicalLink.find("span.han").first().text().trim(),
        href: radicalLink.attr("href") || "",
        name: radicalLink.find("span.font-semibold").first().text().trim(),
        note: radicalLink.find("span.block").first().text().trim(),
      }
    : null;

  const tipBlock = $('div:contains("Mẹo")').filter((_, el) => $(el).find("strong").text().includes("Mẹo")).last();
  const strokeTip = tipBlock.length ? tipBlock.text().replace(/^\s*Mẹo:\s*/, "").trim() : null;

  return {
    title: $("h1").first().text().trim(),
    description: $("header p").first().text().trim(),
    breadcrumbHref: breadcrumbLink.attr("href") || "/radicals",
    breadcrumbText: breadcrumbLink.text().trim(),
    chars,
    radical,
    strokeTip,
  };
}
