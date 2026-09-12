"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import HanziWriter from "hanzi-writer";

type Mode = "demo" | "quiz";

export default function HanziWriterPractice({ initialChar = "你" }: { initialChar?: string }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<ReturnType<typeof HanziWriter.create> | null>(null);
  const [char, setChar] = useState(initialChar);
  const [input, setInput] = useState(initialChar);
  const [mode, setMode] = useState<Mode>("demo");
  const [quizResult, setQuizResult] = useState<"correct" | "mistake" | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    target.innerHTML = "";
    setLoadError(false);
    setQuizResult(null);

    const writer = HanziWriter.create(target, char, {
      width: 240,
      height: 240,
      padding: 12,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,
      showOutline: true,
      strokeColor: "#c81e1e",
      radicalColor: "#059669",
      onLoadCharDataError: () => setLoadError(true),
    });
    writerRef.current = writer;

    if (mode === "demo") {
      writer.animateCharacter();
    } else {
      writer.quiz({
        onComplete: () => setQuizResult("correct"),
        onMistake: () => setQuizResult("mistake"),
      });
    }

    return () => {
      writerRef.current = null;
    };
  }, [char, mode]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const next = input.trim().charAt(0);
    if (next) setChar(next);
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={4}
          placeholder="Nhập một chữ Hán, ví dụ: 学"
          className="han flex-1 rounded-xl border border-ink-200 px-3 py-2 text-lg focus:border-brand-300 focus:outline-none"
        />
        <button type="submit" className="btn-primary px-5">
          Xem
        </button>
      </form>

      <div className="mt-4 flex justify-center">
        <div
          ref={targetRef}
          className="han flex items-center justify-center rounded-xl border border-ink-100 bg-ink-50 text-4xl text-ink-300"
          style={{ width: 240, height: 240 }}
        />
      </div>

      {loadError && (
        <p className="mt-3 text-center text-xs text-gold-700">
          Không tìm thấy dữ liệu nét viết cho &ldquo;{char}&rdquo; trong bộ dữ liệu mở — thử một chữ khác.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("demo")}
          className={mode === "demo" ? "btn-primary px-4 py-2 text-sm" : "btn-secondary px-4 py-2 text-sm"}
        >
          Xem mẫu
        </button>
        <button
          type="button"
          onClick={() => setMode("quiz")}
          className={mode === "quiz" ? "btn-primary px-4 py-2 text-sm" : "btn-secondary px-4 py-2 text-sm"}
        >
          Tự viết (đố vui)
        </button>
        {mode === "demo" && (
          <button
            type="button"
            onClick={() => writerRef.current?.animateCharacter()}
            aria-label="Xem lại"
            className="rounded-full p-2 text-ink-500 hover:bg-ink-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {mode === "quiz" && (
        <p className="mt-3 text-center text-sm font-bold">
          {quizResult === "correct" && <span className="text-jade-600">Chính xác! 🎉</span>}
          {quizResult === "mistake" && <span className="text-gold-700">Sai nét rồi, thử lại nét đó xem.</span>}
          {quizResult === null && <span className="text-ink-400">Vẽ từng nét theo đúng thứ tự vào ô trên.</span>}
        </p>
      )}
    </div>
  );
}
