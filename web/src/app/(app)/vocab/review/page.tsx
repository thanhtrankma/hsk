import Link from "next/link";

export default function VocabReviewPage() {
  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-jade-500 text-2xl text-white">
          空
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-ink-800">Bạn đã ôn hết hôm nay!</h1>
        <p className="mt-2 text-sm text-ink-500">
          Quay lại sau vài giờ — hệ thống lặp lại ngắt quãng (SRS) sẽ tự đẩy lên những từ sắp quên đúng lúc.
          Trong khi chờ, học bài mới sẽ thêm từ vào hàng đợi ôn.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/hsk" className="rounded-full bg-brand-500 px-5 py-2 text-sm font-bold text-white">
            Học bài mới
          </Link>
          <Link
            href="/vocab/my-words"
            className="rounded-full border border-ink-200 px-5 py-2 text-sm font-bold text-ink-700"
          >
            Về bảng học tập
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Đang học", value: 0, color: "text-brand-600" },
          { label: "Đã thuộc", value: 0, color: "text-jade-600" },
          { label: "Thành thạo", value: 0, color: "text-gold-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-4 text-center">
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="mt-1 text-xs font-semibold text-ink-500 uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
