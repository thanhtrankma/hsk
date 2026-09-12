import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getPageByPath } from "@/lib/pages";
import PronunciationTabs from "@/components/PronunciationTabs";
import ScrapedContent from "@/components/ScrapedContent";
import type { AudioEntry } from "@/components/AudioManifestSection";

// The scraped HTML for this page is a full self-contained layout (its own
// max-w container, padding, hero section), so the intro/FAQ sections are
// rendered directly here instead of through the generic [...slug] template
// (same as /beginner). The interior tab content, though, is now built
// entirely from real recorded audio downloaded from cge.edu.vn
// (scraper/capture_cge_audio.py, per explicit confirmation from that
// content's owner) instead of the original site's TTS-driven "Phát âm"
// buttons -- browser TTS kept mispronouncing things. Its 4 pages map 1:1
// onto 4 study categories here, each grouped the same way the source
// organizes it pedagogically (by place of articulation / mouth shape /
// rule number) for easier review.
export const dynamic = "force-dynamic";

const INTRO_FILE = path.join(process.cwd(), "content", "_manual", "pronunciation-tabs.json");

function readIntro(): { before: string; after: string } | null {
  try {
    const data = JSON.parse(fs.readFileSync(INTRO_FILE, "utf-8"));
    return { before: data.before, after: data.after };
  } catch {
    return null;
  }
}

const AUDIO_MANIFEST_FILE = path.join(process.cwd(), "public", "audio", "cge", "manifest.json");

const CATEGORIES = [
  { key: "thanh-dieu", label: "4 thanh điệu" },
  { key: "thanh-mau", label: "Phụ âm đầu (thanh mẫu)" },
  { key: "van-mau", label: "Vần (vận mẫu)" },
  { key: "quy-tac-phat-am", label: "Quy tắc & biến điệu" },
];

function readAudioManifest(): Record<string, AudioEntry[]> | null {
  try {
    return JSON.parse(fs.readFileSync(AUDIO_MANIFEST_FILE, "utf-8"));
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByPath("/pronunciation");
  if (!page) return {};
  return {
    title: page.title ? `${page.title} | HSKGo` : "HSKGo",
    description: page.description || undefined,
  };
}

export default async function PronunciationPage() {
  const page = await getPageByPath("/pronunciation");
  if (!page) notFound();

  const audioManifest = readAudioManifest();

  // Fallback: audio not downloaded yet on this checkout (fresh clone that
  // hasn't run capture_cge_audio.py) — fall back to the plain scraped page.
  if (!audioManifest) {
    return <ScrapedContent html={page.mainHtml} />;
  }

  const intro = readIntro();
  const categories = CATEGORIES.map((c) => ({ ...c, entries: audioManifest[c.key] || [] })).filter(
    (c) => c.entries.length > 0,
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14">
      {intro && <ScrapedContent html={intro.before} />}
      <PronunciationTabs categories={categories} />
      {intro && <ScrapedContent html={intro.after} />}
    </div>
  );
}
