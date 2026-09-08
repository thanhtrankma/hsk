import Link from "next/link";
import { prisma } from "@/lib/db";
import PinyinSpeedGame from "./PinyinSpeedGame";

export const dynamic = "force-dynamic";

type WordRow = { id: string; hanzi: string; pinyin: string; meaningVi: string };

export default async function PinyinSpeedPage() {
  const words = await prisma.$queryRaw<WordRow[]>`
    SELECT id, hanzi, pinyin, "meaningVi" FROM "VocabWord"
    ORDER BY random() LIMIT 60
  `;

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/game" className="text-xs font-semibold text-ink-400 hover:text-brand-600">
        ‹ Trò chơi
      </Link>
      <h1 className="mt-1 text-2xl font-extrabold text-ink-800">Gõ pinyin tốc độ</h1>
      <p className="mt-1 text-sm text-ink-500">
        Từ hiện lên, gõ đúng pinyin (không cần dấu thanh) rồi Enter. 60 giây, càng nhiều càng tốt.
      </p>

      <div className="mt-4">
        {words.length > 0 ? (
          <PinyinSpeedGame words={words} />
        ) : (
          <p className="rounded-xl border border-ink-100 bg-white p-6 text-center text-sm text-ink-400">
            Chưa có dữ liệu từ vựng — chạy <code>npm run db:import-vocab</code> trước.
          </p>
        )}
      </div>
    </div>
  );
}
