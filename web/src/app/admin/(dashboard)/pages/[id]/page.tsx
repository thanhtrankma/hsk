import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updatePage } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-800">Sửa trang</h1>
        <Link href={page.path} target="_blank" className="text-sm font-bold text-brand-600 hover:underline">
          Xem trang thật ↗
        </Link>
      </div>

      <form action={updatePage.bind(null, page.id)} className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink-700">Path (URL)</label>
            <input
              name="path"
              defaultValue={page.path}
              required
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink-700">Section</label>
            <input
              name="section"
              defaultValue={page.section}
              required
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">Tiêu đề</label>
          <input
            name="title"
            defaultValue={page.title}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">Mô tả</label>
          <textarea
            name="description"
            defaultValue={page.description}
            rows={2}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">Nội dung (HTML)</label>
          <textarea
            name="mainHtml"
            defaultValue={page.mainHtml}
            rows={16}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-xs"
          />
          <p className="mt-1 text-xs text-ink-400">
            HTML thô hiển thị trực tiếp trên trang public — sửa cẩn thận, không lọc XSS ở bản demo này.
          </p>
        </div>
        <button className="w-full rounded-lg bg-brand-500 py-2 text-sm font-bold text-white hover:bg-brand-600">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}
