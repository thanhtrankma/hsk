import Link from "next/link";

export default function ExamHistoryPage() {
  return (
    <div>
      <Link href="/exam" className="text-xs font-semibold text-ink-400 hover:text-brand-600">
        ‹ Thi thử
      </Link>
      <h1 className="mt-1 text-2xl font-extrabold text-ink-800">Lịch sử thi thử</h1>
      <p className="mt-1 text-sm text-ink-500">
        Tổng 0 lần thi. Click một lần để xem chi tiết — đáp án + giải thích đã lưu.
      </p>

      <div className="mt-5 rounded-2xl border border-ink-100 bg-white p-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-50 text-2xl">
          🏆
        </div>
        <p className="mt-3 font-bold text-ink-800">Chưa có lần thi nào</p>
        <p className="mt-1 text-sm text-ink-500">Hãy thử đề HSK 1 để bắt đầu rèn luyện.</p>
        <Link
          href="/exam/hsk1"
          className="mt-4 inline-flex rounded-full bg-brand-500 px-5 py-2 text-sm font-bold text-white"
        >
          Vào đề HSK 1
        </Link>
      </div>
    </div>
  );
}
