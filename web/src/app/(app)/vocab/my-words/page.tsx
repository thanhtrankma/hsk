export default function VocabMyWordsPage() {
  return (
    <div>
      <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
        SỔ TAY
      </span>
      <h1 className="mt-2 text-2xl font-extrabold text-ink-800">Sổ tay từ vựng</h1>
      <p className="mt-1 text-sm text-ink-500">
        0/4000 từ đã lưu — thêm ghi chú, thẻ phân loại và ôn lại bất cứ lúc nào.
      </p>
      <div className="mt-3 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-ink-100">
        <div className="h-full w-0 rounded-full bg-brand-500" />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          disabled
          placeholder="Tìm hán tự, pinyin, nghĩa hoặc ghi chú..."
          className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm placeholder:text-ink-400"
        />
        <button className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white">+ Thêm từ</button>
      </div>

      <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-10 text-center">
        <p className="font-bold text-ink-800">Sổ tay còn trống</p>
        <p className="mt-1 text-sm text-ink-500">
          Trong bài học hoặc từ điển, bấm ngôi sao bên cạnh một từ để lưu vào sổ tay — hoặc tự nhập từ bạn
          gặp ngoài đời.
        </p>
        <button className="mt-4 rounded-full bg-brand-500 px-5 py-2 text-sm font-bold text-white">
          + Tự nhập từ đầu tiên
        </button>
      </div>
    </div>
  );
}
