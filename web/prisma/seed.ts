// One-time / re-runnable import: loads the scraper's output
// (content/manifest.json + content/**/*.json) into the Page table, and adds
// a few sample Users so /admin has something to show. Safe to run again —
// every write is an upsert.
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const CONTENT_DIR = path.join(process.cwd(), "content");

type ManifestEntry = { path: string; section: string; title: string; description: string };
type ScrapedPage = {
  path: string;
  section: string;
  title: string;
  description: string;
  main_html: string;
  headings: unknown[];
  internal_links: unknown[];
};

// The scraper faithfully copies hanbeego.com's own text, which says
// "Hanbeego" everywhere (titles, legal copy, ...). Rebrand it to HSKGo here,
// at import time, so re-scraping + re-seeding later doesn't undo the rename
// in scraper.py itself. Word-boundary + case-sensitive so it doesn't touch
// the lowercase "hanbeego.com" domain/email references some legal pages
// legitimately still contain.
function rebrand(text: string): string {
  return text.replace(/\bHanbeego\b/g, "HSKGo");
}

function contentFileForPath(p: string): string {
  if (p === "/") return path.join(CONTENT_DIR, "_index.json");
  return path.join(CONTENT_DIR, ...p.split("/").filter(Boolean).slice(0, -1), `${p.split("/").filter(Boolean).at(-1)}.json`);
}

async function importPages() {
  const manifestPath = path.join(CONTENT_DIR, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    console.warn(`No ${manifestPath} found - run the scraper first. Skipping page import.`);
    return;
  }
  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  let imported = 0;
  for (const entry of manifest) {
    const file = contentFileForPath(entry.path);
    if (!fs.existsSync(file)) continue;
    const page: ScrapedPage = JSON.parse(fs.readFileSync(file, "utf-8"));

    const title = rebrand(page.title);
    const description = rebrand(page.description);
    const mainHtml = rebrand(page.main_html);

    await prisma.page.upsert({
      where: { path: page.path },
      create: {
        path: page.path,
        section: page.section,
        title,
        description,
        mainHtml,
        headings: page.headings as object,
        internalLinks: page.internal_links as object,
      },
      update: {
        section: page.section,
        title,
        description,
        mainHtml,
        headings: page.headings as object,
        internalLinks: page.internal_links as object,
      },
    });
    imported++;
    if (imported % 200 === 0) console.log(`  ...${imported} pages imported`);
  }
  console.log(`Imported ${imported} pages into Postgres.`);
}

async function seedSampleUsers() {
  const samples = [
    { email: "demo.hocvien1@example.com", displayName: "Học viên Demo 1", hskLevel: "HSK 3", xpTotal: 4820, streakDays: 12, membership: "premium" as const },
    { email: "demo.hocvien2@example.com", displayName: "Học viên Demo 2", hskLevel: "HSK 1", xpTotal: 150, streakDays: 2, membership: "free" as const },
    { email: "demo.hocvien3@example.com", displayName: "Học viên Demo 3", hskLevel: "HSK 5", xpTotal: 15200, streakDays: 40, membership: "premium" as const },
  ];
  for (const u of samples) {
    await prisma.user.upsert({ where: { email: u.email }, create: u, update: u });
  }
  console.log(`Seeded ${samples.length} sample users.`);
}

async function main() {
  await importPages();
  await seedSampleUsers();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
