"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HanziWriterPractice from "@/app/(app)/tools/writing/HanziWriterPractice";

type VocabInfo = { pinyin: string; meaningVi: string; hskLevel: number };

export default function RadicalWritingPractice({
  chars,
  vocabByChar,
  radical,
  strokeTip,
}: {
  chars: string[];
  vocabByChar: Record<string, VocabInfo | undefined>;
  radical: { char: string; href: string; name: string; note: string } | null;
  strokeTip: string | null;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chars;
    return chars.filter((c) => {
      const v = vocabByChar[c];
      return c.includes(query.trim()) || v?.pinyin.toLowerCase().includes(q) || v?.meaningVi.toLowerCase().includes(q);
    });
  }, [query, chars, vocabByChar]);

  const activeChar = chars[activeIndex] ?? chars[0];
  const info = vocabByChar[activeChar];

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
      <aside className="order-2 lg:order-1 lg:col-span-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm chữ, pinyin hoặc nghĩa…"
          className="w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-jade-300"
        />
        <p className="mt-3 mb-3 text-xs font-semibold tracking-wider text-ink-400 uppercase">Chữ ({chars.length})</p>
        <div className="grid max-h-[340px] grid-cols-6 gap-2 overflow-y-auto pr-2 lg:grid-cols-4">
          {filtered.map((c) => {
            const i = chars.indexOf(c);
            const active = i === activeIndex;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={
                  active
                    ? "han flex aspect-square items-center justify-center rounded-xl border-2 border-ink-800 bg-ink-50 text-xl text-ink-900 transition-all"
                    : "han flex aspect-square items-center justify-center rounded-xl border-2 border-ink-100 bg-white text-xl text-ink-400 transition-all hover:border-jade-300 hover:text-ink-700"
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </aside>

      <section className="order-1 flex flex-col items-center lg:order-2 lg:col-span-6">
        <HanziWriterPractice key={activeChar} initialChar={activeChar} />
      </section>

      <aside className="order-3 space-y-3.5 lg:col-span-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-3.5 text-center">
          <p className="han text-4xl leading-none font-medium text-ink-900">{activeChar}</p>
          {info ? (
            <>
              <p className="pinyin mt-2 text-base font-semibold text-brand-600">{info.pinyin}</p>
              <p className="mt-2 text-sm font-medium text-ink-800">{info.meaningVi}</p>
              <span className="mt-2 inline-flex items-center rounded-full bg-jade-50 px-2 py-1 text-[10px] font-bold tracking-wider text-jade-700 uppercase">
                HSK {info.hskLevel}
              </span>
            </>
          ) : (
            <Link href={`/tools/dictionary?q=${encodeURIComponent(activeChar)}`} className="mt-2 block text-xs text-ink-400 hover:text-brand-600">
              Chưa có trong từ điển — tra thử ở đây →
            </Link>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            className="flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm font-medium transition-colors hover:bg-ink-50 disabled:opacity-50"
          >
            ‹ Trước
          </button>
          <button
            type="button"
            disabled={activeIndex === chars.length - 1}
            onClick={() => setActiveIndex((i) => Math.min(chars.length - 1, i + 1))}
            className="flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm font-medium transition-colors hover:bg-ink-50 disabled:opacity-50"
          >
            Tiếp ›
          </button>
        </div>

        {radical && (
          <div className="rounded-2xl border border-gold-200 bg-gold-50 p-3">
            <p className="mb-2.5 text-[10px] font-semibold tracking-wider text-gold-700 uppercase">Bộ thủ & mẹo nhớ</p>
            <Link href={radical.href} className="group flex items-center gap-3">
              <span className="han grid size-11 shrink-0 place-items-center rounded-xl border border-gold-200 bg-white text-2xl text-ink-900">
                {radical.char}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-gold-900 group-hover:underline">{radical.name}</span>
                <span className="block text-xs text-gold-800/80">{radical.note}</span>
              </span>
            </Link>
          </div>
        )}

        {strokeTip && (
          <div className="rounded-2xl bg-ink-50 p-3 text-xs leading-relaxed text-ink-500">
            <strong>Mẹo</strong>: {strokeTip}
          </div>
        )}
      </aside>
    </div>
  );
}
