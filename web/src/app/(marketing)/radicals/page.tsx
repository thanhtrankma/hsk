import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageByPath } from "@/lib/pages";
import { parseRadicalsIndexHtml } from "@/lib/parse-radicals-index";
import ScrapedContent from "@/components/ScrapedContent";
import RadicalsBrowser from "@/components/RadicalsBrowser";

// The "Phân nhóm" category filter here never had a working click handler
// in this clone (see parse-radicals-index.ts for how the grouping was
// reconstructed from data already in the scrape). Header/stats/FAQ sections
// are unaffected by the filter, so they stay as plain scraped content.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByPath("/radicals");
  if (!page) return {};
  return {
    title: page.title ? `${page.title} | HSKGo` : "HSKGo",
    description: page.description || undefined,
  };
}

export default async function RadicalsIndexPage() {
  const page = await getPageByPath("/radicals");
  if (!page) notFound();

  const parsed = parseRadicalsIndexHtml(page.mainHtml);
  if (!parsed) {
    return <ScrapedContent html={page.mainHtml} />;
  }

  return (
    <article className="mx-auto max-w-[1400px] px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14">
      <ScrapedContent html={parsed.before} />
      <RadicalsBrowser categories={parsed.categoryCounts} radicals={parsed.radicals} />
      <ScrapedContent className="mt-14" html={parsed.statsSection} />
      <ScrapedContent className="mt-14" html={parsed.faqSection} />
    </article>
  );
}
