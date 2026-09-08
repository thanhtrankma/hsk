import { createPage } from "../../../actions";

export default function NewPagePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-ink-800">Thêm trang mới</h1>

      <form action={createPage} className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink-700">Path (URL, vd: /reading/moi)</label>
            <input
              name="path"
              required
              placeholder="/vi-du/trang-moi"
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink-700">Section</label>
            <input
              name="section"
              required
              placeholder="reading"
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">Tiêu đề</label>
          <input name="title" className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">Mô tả</label>
          <textarea name="description" rows={2} className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-ink-700">Nội dung (HTML)</label>
          <textarea
            name="mainHtml"
            rows={12}
            placeholder="<div class=&quot;p-6&quot;><h1>Xin chào</h1></div>"
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 font-mono text-xs"
          />
        </div>
        <button className="w-full rounded-lg bg-brand-500 py-2 text-sm font-bold text-white hover:bg-brand-600">
          Tạo trang
        </button>
      </form>
    </div>
  );
}
