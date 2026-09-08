import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function search(q: string) {
  if (!q.trim()) return [];
  return prisma.vocabWord.findMany({
    where: {
      OR: [
        { hanzi: { contains: q } },
        { pinyin: { contains: q, mode: "insensitive" } },
        { meaningVi: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { hskLevel: "asc" },
    take: 40,
  });
}

export default async function DictionaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await search(q);
  const totalWords = await prisma.vocabWord.count();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/tools" className="text-xs font-semibold text-ink-400 hover:text-brand-600">
        ‹ Công cụ
      </Link>
      <h1 className="mt-1 text-2xl font-extrabold text-ink-800">Từ điển HSK</h1>
      <p className="mt-1 text-sm text-ink-500">
        Tra hanzi, pinyin hoặc nghĩa tiếng Việt trong dataset {totalWords.toLocaleString("vi-VN")} từ.
      </p>

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="vd: 你好, nihao, xin chào..."
          className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-brand-400"
        />
      </form>

      <div className="mt-4 space-y-2">
        {q && results.length === 0 && (
          <p className="rounded-xl border border-ink-100 bg-white p-4 text-center text-sm text-ink-400">
            Không tìm thấy &ldquo;{q}&rdquo;.
          </p>
        )}
        {results.map((w) => (
          <div key={w.id} className="flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-4">
            <span className="han text-2xl text-ink-900">{w.hanzi}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-brand-600">{w.pinyin}</span>
                <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500">
                  HSK {w.hskLevel}
                </span>
              </div>
              <p className="text-sm text-ink-700">{w.meaningVi}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
