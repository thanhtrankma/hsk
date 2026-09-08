import Link from "next/link";
import { listPages, countPages } from "@/lib/pages";
import { deletePage } from "../../actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 30;

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; section?: string; page?: string }>;
}) {
  const { q, section, page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr ?? 1) || 1);

  const [pages, total] = await Promise.all([
    listPages({ q, section, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    countPages({ q, section }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const qs = (overrides: Record<string, string | number>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (section) params.set("section", section);
    if (page) params.set("page", String(page));
    for (const [k, v] of Object.entries(overrides)) params.set(k, String(v));
    return `?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-800">Nội dung (Pages)</h1>
        <Link
          href="/admin/pages/new"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600"
        >
          + Thêm trang
        </Link>
      </div>

      <form className="mt-4 flex gap-3">
        <input
          type="hidden"
          name="section"
          value={section ?? ""}
        />
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo path hoặc tiêu đề..."
          className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm"
        />
        <button className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-bold text-ink-700 hover:bg-ink-50">
          Tìm
        </button>
      </form>

      <p className="mt-3 text-sm text-ink-500">
        {total.toLocaleString("vi-VN")} trang{section ? ` trong "${section}"` : ""}
      </p>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink-100 text-xs font-bold text-ink-400 uppercase">
            <tr>
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Cập nhật</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-ink-50 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-ink-600">{p.path}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-600">
                    {p.section}
                  </span>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-ink-800">{p.title}</td>
                <td className="px-4 py-3 text-ink-400">{p.updatedAt.toISOString().slice(0, 10)}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link href={`/admin/pages/${p.id}`} className="font-bold text-brand-600 hover:underline">
                    Sửa
                  </Link>
                  <form action={deletePage.bind(null, p.id)} className="inline">
                    <button className="font-bold text-red-600 hover:underline">Xoá</button>
                  </form>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-400">
                  Không tìm thấy trang nào. Chạy <code>npm run db:seed</code> để import từ scraper.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <Link
            href={qs({ page: Math.max(1, page - 1) })}
            className="rounded-lg border border-ink-200 px-3 py-1.5 font-bold text-ink-600 hover:bg-ink-50"
          >
            ← Trước
          </Link>
          <span className="text-ink-500">
            Trang {page}/{totalPages}
          </span>
          <Link
            href={qs({ page: Math.min(totalPages, page + 1) })}
            className="rounded-lg border border-ink-200 px-3 py-1.5 font-bold text-ink-600 hover:bg-ink-50"
          >
            Sau →
          </Link>
        </div>
      )}
    </div>
  );
}
