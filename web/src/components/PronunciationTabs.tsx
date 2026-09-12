"use client";

import { useState } from "react";
import AudioManifestSection, { type AudioEntry } from "./AudioManifestSection";

export type PronunciationCategory = { key: string; label: string; entries: AudioEntry[] };

export default function PronunciationTabs({ categories }: { categories: PronunciationCategory[] }) {
  const [active, setActive] = useState(0);
  const current = categories[active];

  return (
    <div className="mt-10">
      <div className="inline-flex flex-wrap rounded-xl border border-ink-100 bg-ink-50 p-1">
        {categories.map((cat, i) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActive(i)}
            aria-current={i === active ? "true" : undefined}
            className={
              i === active
                ? "rounded-lg bg-white px-4 py-2 text-sm font-bold text-brand-600 shadow-sm"
                : "rounded-lg px-4 py-2 text-sm font-semibold text-ink-500 hover:text-ink-700"
            }
          >
            {cat.label}
          </button>
        ))}
      </div>
      <AudioManifestSection entries={current.entries} />
    </div>
  );
}
