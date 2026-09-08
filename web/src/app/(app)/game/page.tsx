import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const GAMES = [
  {
    href: "/game/pinyin-speed",
    icon: "⌨️",
    title: "Gõ pinyin tốc độ",
    desc: "Từ hiện lên, gõ pinyin thật nhanh trong 60 giây.",
  },
  {
    href: "/game/listen-guess",
    icon: "🎧",
    title: "Nghe đoán chữ",
    desc: "Nghe phát âm rồi chọn đúng chữ Hán. Sai 3 lần là hết ván.",
  },
];

export default async function GameHubPage() {
  const wordCount = await prisma.vocabWord.count();

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-br from-jade-500 to-jade-700 p-6 text-white">
        <p className="text-sm font-bold uppercase tracking-wide text-jade-100">Học mà chơi</p>
        <h1 className="mt-1 text-2xl font-extrabold">Chơi mà giỏi!</h1>
        <p className="mt-1 text-jade-100">
          Vừa chơi game vừa ôn {wordCount.toLocaleString("vi-VN")} từ vựng thật trong dataset.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {GAMES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="rounded-2xl border border-ink-100 bg-white p-5 transition-colors hover:border-jade-300"
          >
            <span className="text-3xl">{g.icon}</span>
            <h2 className="mt-3 font-bold text-ink-800">{g.title}</h2>
            <p className="mt-1 text-sm text-ink-500">{g.desc}</p>
            <span className="mt-3 inline-block text-sm font-bold text-jade-600">Chơi ngay →</span>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-400">
        Đấu trường PK 1v1 trực tiếp chưa có ở bản này — cần hạ tầng ghép trận + realtime riêng.
      </p>
    </div>
  );
}
