// Parses structured word cards out of the already-scraped /vocab/topics/*
// pages (each card is `.han` + an "HSK N" badge + `.pinyin` + a Vietnamese
// meaning <p>, see the scraper's sanitized main_html) and loads them into
// the VocabWord table. Run after prisma/seed.ts has imported Pages.
import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function importVocabWords() {
  const pages = await prisma.page.findMany({
    where: { path: { startsWith: "/vocab/topics/" } },
  });

  const seen = new Map<string, { hanzi: string; pinyin: string; meaningVi: string; hskLevel: number; topic: string }>();

  for (const page of pages) {
    const topic = page.path.split("/").pop() ?? page.section;
    const $ = cheerio.load(page.mainHtml);

    $(".han").each((_, el) => {
      const hanzi = $(el).text().trim();
      if (!hanzi) return;
      // the card is the nearest rounded-corner container ancestor, not the
      // immediate parent (which is just the hanzi+badge row)
      const card = $(el).closest('div[class*="rounded-2xl"]');
      if (!card.length) return;

      const badgeText = card.find("span").filter((_, s) => /HSK\s*\d/.test($(s).text())).first().text();
      const hskMatch = badgeText.match(/HSK\s*(\d)/);
      if (!hskMatch) return; // not a vocab card (e.g. a heading that happens to use .han)
      const hskLevel = Number(hskMatch[1]);

      const pinyin = card.find(".pinyin").first().text().trim().replace(/\s+/g, " ");
      const meaningVi = card.find("p").first().text().trim();
      if (!pinyin || !meaningVi) return;

      seen.set(`${hanzi}::${pinyin}`, { hanzi, pinyin, meaningVi, hskLevel, topic });
    });
  }

  let count = 0;
  for (const word of seen.values()) {
    await prisma.vocabWord.upsert({
      where: { hanzi_pinyin: { hanzi: word.hanzi, pinyin: word.pinyin } },
      create: word,
      update: word,
    });
    count++;
  }
  console.log(`Imported ${count} unique vocab words from ${pages.length} topic pages.`);
}

importVocabWords()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
