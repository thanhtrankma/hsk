"use client";

import { useEffect, useState } from "react";

type Word = { id: string; hanzi: string; pinyin: string; meaningVi: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRound(words: Word[], answer: Word) {
  const distractors = shuffle(words.filter((w) => w.id !== answer.id)).slice(0, 3);
  return shuffle([answer, ...distractors]);
}

export default function ListenGuessGame({ words }: { words: Word[] }) {
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [pool, setPool] = useState<Word[]>([]);
  const [answer, setAnswer] = useState<Word | null>(null);
  const [choices, setChoices] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [picked, setPicked] = useState<string | null>(null);
  const [voiceSupported, setVoiceSupported] = useState(true);

  useEffect(() => {
    setVoiceSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  function speak(text: string) {
    if (!voiceSupported) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "zh-CN";
    utter.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function nextRound(remaining: Word[]) {
    if (remaining.length === 0) {
      setStatus("finished");
      return;
    }
    const [next, ...rest] = remaining;
    setPool(rest);
    setAnswer(next);
    setChoices(buildRound(words, next));
    setPicked(null);
    setTimeout(() => speak(next.hanzi), 150);
  }

  function start() {
    setScore(0);
    setLives(3);
    setStatus("playing");
    nextRound(shuffle(words));
  }

  function choose(word: Word) {
    if (picked || !answer) return;
    setPicked(word.id);
    if (word.id === answer.id) {
      setScore((s) => s + 1);
      setTimeout(() => nextRound(pool), 500);
    } else {
      setLives((l) => {
        const left = l - 1;
        if (left <= 0) setTimeout(() => setStatus("finished"), 500);
        else setTimeout(() => nextRound(pool), 500);
        return left;
      });
    }
  }

  if (status === "idle") {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center">
        {!voiceSupported && (
          <p className="mb-3 text-xs text-gold-700">
            Trình duyệt này không hỗ trợ đọc tiếng Trung — pinyin sẽ hiện sẵn thay thế.
          </p>
        )}
        <p className="text-sm text-ink-500">{words.length} từ sẵn sàng.</p>
        <button
          onClick={start}
          className="mt-4 rounded-full bg-jade-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-jade-600"
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
        <p className="mt-2 text-4xl font-extrabold text-jade-600">{score}</p>
        <p className="text-sm text-ink-500">câu đúng</p>
        <button
          onClick={start}
          className="mt-4 rounded-full bg-jade-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-jade-600"
        >
          Chơi lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm font-bold">
        <span className="text-jade-600">{score} đúng</span>
        <span className="text-red-500">{"❤️".repeat(lives)}</span>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <button
          onClick={() => answer && speak(answer.hanzi)}
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-jade-100 text-3xl text-jade-700"
          aria-label="Nghe lại"
        >
          🔊
        </button>
        {!voiceSupported && answer && (
          <p className="han mt-2 text-lg text-ink-400">{answer.pinyin}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          {choices.map((c) => {
            const isAnswer = c.id === answer?.id;
            const isPicked = picked === c.id;
            const showState = picked !== null;
            return (
              <button
                key={c.id}
                onClick={() => choose(c)}
                disabled={picked !== null}
                className={`rounded-xl border-2 p-4 text-2xl han transition-colors ${
                  showState && isAnswer
                    ? "border-jade-400 bg-jade-50"
                    : showState && isPicked
                      ? "border-red-400 bg-red-50"
                      : "border-ink-100 hover:border-jade-300"
                }`}
              >
                {c.hanzi}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
