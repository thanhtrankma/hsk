import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageByPath } from "@/lib/pages";
import ScrapedContent from "@/components/ScrapedContent";

// The scraped HTML for this page is a full self-contained layout (its own
// max-w container, padding, hero section) — unlike most scraped pages it
// isn't a bare content fragment, so it's rendered directly here instead of
// going through the generic [...slug] template, which would otherwise wrap
// it in a second max-w container and a redundant breadcrumb+H1 that
// duplicates the heading already inside the hero.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByPath("/beginner");
  if (!page) return {};
  return {
    title: page.title ? `${page.title} | HSKGo` : "HSKGo",
    description: page.description || undefined,
  };
}

export default async function BeginnerPage() {
  const page = await getPageByPath("/beginner");
  if (!page) notFound();

  return <ScrapedContent html={page.mainHtml} />;
}
