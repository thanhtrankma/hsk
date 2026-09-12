import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageByPath } from "@/lib/pages";
import { parseRadicalWritingHtml } from "@/lib/parse-radical-writing";
import { prisma } from "@/lib/db";
import ScrapedContent from "@/components/ScrapedContent";
import RadicalWritingPractice from "./RadicalWritingPractice";

// The scraped page for these always had an empty placeholder where the
// original's client-side writing canvas used to render (a plain HTTP scrape
// can't capture that). Everything else on the page -- the character list,
// the radical mnemonic, the stroke-order tip -- parses cleanly, so this
// route keeps that real scraped data and fills the gap with a genuine
// interactive canvas (Hanzi Writer + the open Make Me a Hanzi dataset),
// covering the same character list for all 420 of these radical pages.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByPath(`/radicals/${slug}/writing`);
  if (!page) return {};
  return {
    title: page.title ? `${page.title} | HSKGo` : "HSKGo",
    description: page.description || undefined,
  };
}

export default async function RadicalWritingPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageByPath(`/radicals/${slug}/writing`);
  if (!page) notFound();

  const parsed = parseRadicalWritingHtml(page.mainHtml);
  if (!parsed) {
    return <ScrapedContent html={page.mainHtml} />;
  }

  const vocabRows = await prisma.vocabWord.findMany({ where: { hanzi: { in: parsed.chars } } });
  const vocabByChar = Object.fromEntries(vocabRows.map((v) => [v.hanzi, v]));

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14">
      <Link href={parsed.breadcrumbHref} className="text-sm font-semibold text-ink-400 hover:text-brand-600">
        ‹ {parsed.breadcrumbText}
      </Link>
      <header className="mt-4 flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-jade-50 text-jade-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-800 sm:text-3xl">{parsed.title}</h1>
          <p className="text-sm text-ink-500">{parsed.description}</p>
        </div>
      </header>

      <RadicalWritingPractice chars={parsed.chars} vocabByChar={vocabByChar} radical={parsed.radical} strokeTip={parsed.strokeTip} />
    </div>
  );
}
