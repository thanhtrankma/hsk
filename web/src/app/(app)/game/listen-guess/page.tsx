import Link from "next/link";
import { prisma } from "@/lib/db";
import ListenGuessGame from "./ListenGuessGame";

export const dynamic = "force-dynamic";

type WordRow = { id: string; hanzi: string; pinyin: string; meaningVi: string };

export default async function ListenGuessPage() {
  const words = await prisma.$queryRaw<WordRow[]>`
    SELECT id, hanzi, pinyin, "meaningVi" FROM "VocabWord"
    ORDER BY random() LIMIT 40
  `;

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/game" className="text-xs font-semibold text-ink-400 hover:text-brand-600">
        ‹ Trò chơi
      </Link>
      <h1 className="mt-1 text-2xl font-extrabold text-ink-800">Nghe đoán chữ</h1>
      <p className="mt-1 text-sm text-ink-500">
        Nghe phát âm (giọng đọc của trình duyệt) rồi chọn đúng chữ Hán. Sai 3 lần là hết ván.
      </p>

      <div className="mt-4">
        {words.length >= 4 ? (
          <ListenGuessGame words={words} />
        ) : (
          <p className="rounded-xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-400">
            Cần ít nhất 4 từ — chạy <code>npm run db:import-vocab</code> trước.
          </p>
        )}
      </div>
    </div>
  );
}
