"use client";

import { useMemo, useState } from "react";
import { pinyin } from "pinyin-pro";

const TONE_CLASS: Record<string, string> = {
  "1": "text-tone-1",
  "2": "text-tone-2",
  "3": "text-tone-3",
  "4": "text-tone-4",
  "5": "text-tone-5",
};

export default function PinyinConverter() {
  const [text, setText] = useState("你好，很高兴认识你！");

  const syllables = useMemo(() => {
    return [...text]
      .filter((char) => !/\s/.test(char))
      .map((char) => {
        const py = pinyin(char, { toneType: "symbol" });
        const withNum = pinyin(char, { toneType: "num" });
        const tone = withNum.match(/[1-5]$/)?.[0] ?? "5";
        return { char, py, tone };
      });
  }, [text]);

  return (
    <div>
      <label className="block text-sm font-bold text-ink-700">Văn bản tiếng Trung</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="mt-1 w-full rounded-xl border border-ink-200 px-4 py-3 text-lg outline-brand-400"
        placeholder="Dán văn bản tiếng Trung vào đây..."
      />

      <div className="mt-4 rounded-xl border border-ink-100 bg-white p-5">
        <p className="mb-2 text-xs font-bold text-ink-400 uppercase">Kết quả (tô màu theo thanh điệu)</p>
        {syllables.length === 0 ? (
          <p className="text-sm text-ink-400">Nhập văn bản để xem pinyin.</p>
        ) : (
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-lg">
            {syllables.map((s, i) => (
              <span key={i} className="inline-flex flex-col items-center">
                <span className={TONE_CLASS[s.tone] ?? "text-tone-5"}>{s.py}</span>
                <span className="han text-sm text-ink-800">{s.char}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {(["1", "2", "3", "4", "5"] as const).map((t) => (
          <span key={t} className={`flex items-center gap-1 font-semibold ${TONE_CLASS[t]}`}>
            <span className="size-2 rounded-full bg-current" /> Thanh {t}
          </span>
        ))}
      </div>
    </div>
  );
}
