const MODES = [
  { title: "Hỏi đáp", desc: "Ngữ pháp, dịch, giải thích từ" },
  { title: "Đóng vai", desc: "Tình huống thực tế" },
  { title: "Sửa câu", desc: "Gửi câu, được chấm + sửa" },
];

export default function TutorPage() {
  return (
    <div>
      <span className="inline-flex items-center gap-1 rounded-full bg-lavender-50 px-3 py-1 text-xs font-bold text-lavender-700">
        AI TUTOR
      </span>
      <h1 className="mt-2 text-2xl font-extrabold text-ink-800">
        Chat với <span className="text-brand-600">Mây</span>
      </h1>
      <p className="mt-1 max-w-xl text-sm text-ink-500">
        Gia sư AI luôn sẵn sàng. Hỏi ngữ pháp, đóng vai tình huống thực, hoặc gửi câu để được sửa.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          <p className="text-xs font-bold text-ink-400 uppercase">Chế độ</p>
          {MODES.map((mode, i) => (
            <div
              key={mode.title}
              className={`rounded-xl border p-3 ${i === 0 ? "border-brand-300 bg-brand-50" : "border-ink-100 bg-white"}`}
            >
              <p className="text-sm font-bold text-ink-800">{mode.title}</p>
              <p className="text-xs text-ink-500">{mode.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex min-h-[420px] flex-col rounded-2xl border border-ink-100 bg-white p-5">
          <div className="flex flex-1 flex-col items-center justify-center text-center text-ink-400">
            <div className="mb-3 text-3xl">🐼</div>
            <p className="font-bold text-ink-600">Hỏi Mây bất cứ điều gì về tiếng Trung</p>
            <p className="mt-1 text-xs">
              Vd: &lsquo;Phân biệt 二 và 两&rsquo;, &lsquo;了 dùng khi nào&rsquo;, &lsquo;Dịch câu này&rsquo;
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2.5">
            <input
              disabled
              placeholder="Hỏi gì đó... (cần nối AI backend để hoạt động)"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
            />
            <button className="rounded-full bg-ink-100 px-3 py-1.5 text-xs font-bold text-ink-400">
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
