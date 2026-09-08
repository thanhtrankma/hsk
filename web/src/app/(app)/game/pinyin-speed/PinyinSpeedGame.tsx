"use client";

import { useEffect, useRef, useState } from "react";

type Word = { id: string; hanzi: string; pinyin: string; meaningVi: string };

const GAME_SECONDS = 60;

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip tone-mark diacritics
    .replace(/\s+/g, "")
    .toLowerCase();
}

export default function PinyinSpeedGame({ words }: { words: Word[] }) {
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(GAME_SECONDS);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const word = words[index % words.length];

  useEffect(() => {
    if (status !== "playing") return;
    if (secondsLeft <= 0) {
      setStatus("finished");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [status, secondsLeft]);

  function start() {
    setStatus("playing");
    setIndex(0);
    setScore(0);
    setWrong(0);
    setSecondsLeft(GAME_SECONDS);
    setInput("");
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function submit() {
    if (!input.trim()) return;
    const ok = normalize(input) === normalize(word.pinyin);
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    else setWrong((w) => w + 1);
    setInput("");
    setIndex((i) => i + 1);
    setTimeout(() => setFeedback(null), 300);
  }

  if (status === "idle") {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <p className="text-sm text-ink-500">{words.length} từ sẵn sàng. Bấm bắt đầu khi bạn sẵn sàng.</p>
        <button
          onClick={start}
          className="mt-4 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
        >
          Bắt đầu
        </button>
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <p className="text-sm font-bold text-ink-400 uppercase">Kết quả</p>
        <p className="mt-2 text-4xl font-extrabold text-brand-600">{score}</p>
        <p className="text-sm text-ink-500">đúng · {wrong} sai</p>
        <button
          onClick={start}
          className="mt-4 rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
        >
          Chơi lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-bold">
        <span className="text-brand-600">⏱ {secondsLeft}s</span>
        <span className="text-jade-600">{score} đúng</span>
        <span className="text-red-500">{wrong} sai</span>
      </div>
      <div
        className={`rounded-2xl border-2 bg-white p-10 text-center transition-colors ${
          feedback === "correct"
            ? "border-jade-400"
            : feedback === "wrong"
              ? "border-red-400"
              : "border-ink-100"
        }`}
      >
        <span className="han text-6xl text-ink-900">{word.hanzi}</span>
        <p className="mt-2 text-sm text-ink-400">{word.meaningVi}</p>
        <div className="mt-4 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Gõ pinyin (vd: nihao)..."
            className="flex-1 rounded-xl border border-ink-200 px-4 py-3 text-center text-lg outline-brand-400"
          />
          <button
            onClick={submit}
            className="rounded-xl bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-600"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
