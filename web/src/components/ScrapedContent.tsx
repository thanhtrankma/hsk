"use client";

import type { MouseEvent } from "react";

// The original site has no real audio files at all (verified: zero <audio>
// tags, zero network requests for audio when clicking a "Phát âm" button,
// across all 2200+ scraped pages) -- pronunciation is synthesized by the
// browser's own Web Speech API, same technique this project's own
// game/listen-guess already uses. The "Phát âm" button pattern shows up on
// 1000+ scraped pages (grammar, blog, radicals, ...), so this wires the
// speechSynthesis call in one shared place instead of per page. Each
// button's row holds a sibling `.han` (character) or `.pinyin` (bare
// syllable, e.g. a lone initial like "b") span with the text to speak.
function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "zh-CN";
  utter.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// Card markup varies across page templates -- sometimes .han/.pinyin sit
// right next to the button, sometimes a level higher. Widen the search
// scope one ancestor at a time, but stop as soon as a wider scope would
// span more than this one button (a sign it now covers a neighboring card
// too), so a button never ends up reading a sibling card's text.
function findSpokenText(btn: HTMLElement): string | undefined {
  let scope: HTMLElement | null = btn.parentElement;
  for (let i = 0; i < 5 && scope; i++) {
    if (scope.querySelectorAll('[aria-label="Phát âm"]').length > 1) break;
    const text = scope.querySelector<HTMLElement>(".han")?.textContent?.trim() || scope.querySelector<HTMLElement>(".pinyin")?.textContent?.trim();
    if (text) return text;
    scope = scope.parentElement;
  }
  return undefined;
}

function handlePronounceClick(e: MouseEvent<HTMLDivElement>) {
  const target = e.target as HTMLElement;
  const btn = target.closest<HTMLElement>('[aria-label="Phát âm"]');
  if (!btn) return;
  const text = findSpokenText(btn);
  if (text) speak(text);
}

export default function ScrapedContent({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={className ? `scraped-content ${className}` : "scraped-content"}
      onClick={handlePronounceClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
