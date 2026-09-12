"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RadicalCard } from "@/lib/parse-radicals-index";

type Category = { label: string; count: number };

// Handwritten to match the 4 confirmed on hanbeego.com; the other 3 follow
// the same one-line style since the source's exact wording for those
// wasn't recoverable from the static scrape.
const DESCRIPTIONS: Record<string, string> = {
  "Con người": "Bộ thủ liên quan đến cơ thể, bộ phận và hành động của người.",
  "Thiên nhiên": "Bộ thủ về các yếu tố tự nhiên: nước, lửa, núi, mặt trời.",
  "Động vật": "Bộ thủ về các loài vật.",
  "Hành động": "Bộ thủ mô tả hành động, cử chỉ và va chạm.",
  "Phương hướng & Địa điểm": "Bộ thủ về hướng, vị trí và không gian.",
  "Đồ vật": "Bộ thủ về vật dụng, thực phẩm, công cụ.",
  "Biểu tượng & Trừu tượng": "Bộ thủ mang tính biểu tượng, số đếm và khái niệm trừu tượng.",
};

export default function RadicalsBrowser({ categories, radicals }: { categories: Category[]; radicals: RadicalCard[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const groups = useMemo(() => {
    let offset = 0;
    return categories.map((c) => {
      const items = radicals.slice(offset, offset + c.count);
      offset += c.count;
      return { ...c, items };
    });
  }, [categories, radicals]);

  const active = groups[activeIndex];

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="-mx-4 flex snap-x gap-2 overflow-x-auto border-b border-ink-100 px-4 py-2 sm:-mx-6 sm:px-6 lg:hidden">
        {groups.map((g, i) => (
          <button
            key={g.label}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={
              i === activeIndex
                ? "shrink-0 snap-start rounded-full border-2 border-ink-800 bg-ink-800 px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-white"
                : "shrink-0 snap-start rounded-full border-2 border-ink-100 bg-white px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-ink-700 hover:border-jade-300"
            }
          >
            {g.label} <span className="ml-1.5 text-xs opacity-70">{g.count}</span>
          </button>
        ))}
      </div>

      <aside className="hidden lg:col-span-3 lg:block">
        <p className="mb-3 text-xs font-semibold tracking-wider text-ink-400 uppercase">Phân nhóm</p>
        <div className="space-y-1.5">
          {groups.map((g, i) => (
            <button
              key={g.label}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={
                i === activeIndex
                  ? "w-full rounded-xl border-2 border-ink-800 bg-ink-50 p-3 text-left transition-all"
                  : "w-full rounded-xl border-2 border-ink-100 bg-white p-3 text-left transition-all hover:border-jade-300"
              }
            >
              <p className="text-sm font-semibold text-ink-800">{g.label}</p>
              <p className="mt-0.5 text-xs text-ink-400">{g.count} bộ</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="lg:col-span-9">
        <p className="mb-4 text-sm leading-relaxed text-ink-500">{DESCRIPTIONS[active.label] || ""}</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
          {active.items.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              aria-label={`Học bộ ${r.han}`}
              className="group block h-full rounded-2xl border border-ink-100 bg-white p-3 transition-all hover:border-jade-300 hover:shadow-md"
            >
              <p className="han text-center text-[2rem] leading-none font-medium text-ink-900 sm:text-4xl">{r.han}</p>
              <p className="pinyin mt-1.5 truncate text-center text-xs text-jade-700 sm:mt-2">{r.name}</p>
              <p className="mt-0.5 line-clamp-1 text-center text-[11px] text-ink-400">{r.meaning}</p>
              <p className="mt-2 border-t border-ink-100 pt-2 text-center text-[10px] font-semibold text-ink-400">{r.stats}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
