import Link from "next/link";
import { prisma } from "@/lib/db";
import HanziWriterPractice from "./HanziWriterPractice";

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
    take: 20,
  });
}

export default async function WritingToolPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; char?: string }>;
}) {
  const { q = "", char } = await searchParams;
  const results = await search(q);
  const activeChar = char || results[0]?.hanzi.charAt(0) || "你";

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/tools" className="text-xs font-semibold text-ink-400 hover:text-brand-600">
        ‹ Công cụ
      </Link>
      <h1 className="mt-1 text-2xl font-extrabold text-ink-800">Luyện viết chữ Hán</h1>
      <p className="mt-1 text-sm text-ink-500">
        Tìm chữ theo hanzi, pinyin hoặc nghĩa tiếng Việt, rồi xem hoạt hình thứ tự nét hoặc tự vẽ để đố vui.
      </p>

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="vd: 你好, nihao, xin chào..."
          className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-brand-400"
        />
      </form>

      {q && (
        <div className="mt-3 space-y-2">
          {results.length === 0 && (
            <p className="rounded-xl border border-ink-100 bg-white p-4 text-center text-sm text-ink-400">
              Không tìm thấy &ldquo;{q}&rdquo;.
            </p>
          )}
          {results.map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3">
              <div className="flex gap-1">
                {[...w.hanzi].map((c, i) => (
                  <Link
                    key={i}
                    href={`?q=${encodeURIComponent(q)}&char=${encodeURIComponent(c)}`}
                    className={
                      c === activeChar
                        ? "han flex size-11 items-center justify-center rounded-lg border-2 border-brand-500 bg-brand-50 text-2xl text-brand-700"
                        : "han flex size-11 items-center justify-center rounded-lg border-2 border-ink-100 text-2xl text-ink-800 hover:border-brand-200"
                    }
                  >
                    {c}
                  </Link>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-brand-600">{w.pinyin}</span>
                  <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-500">
                    HSK {w.hskLevel}
                  </span>
                </div>
                <p className="truncate text-sm text-ink-700">{w.meaningVi}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <HanziWriterPractice key={activeChar} initialChar={activeChar} />
      </div>
    </div>
  );
}
