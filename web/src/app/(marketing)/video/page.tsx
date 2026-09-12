import Link from "next/link";

export const metadata = {
  title: "Học qua video | HSKGo",
  description: "Thư viện video học tiếng Trung đang được phát triển.",
};

export default function VideoHubPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
        HỌC QUA VIDEO
      </span>
      <h1 className="mt-3 text-2xl font-extrabold text-ink-800 sm:text-3xl">
        Thư viện video đang được phát triển
      </h1>
      <p className="mt-3 text-ink-500">
        Bản gốc có thư viện video học tiếng Trung, nhưng nội dung đó không nằm trong dữ liệu đã
        cào được (không có trong sitemap) nên chưa thể phục dựng ở đây. Trong lúc chờ, hãy thử các
        bài học và công cụ luyện tập bên dưới.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/hsk" className="btn-primary px-6 py-3">
          Xem lộ trình HSK
        </Link>
        <Link href="/hsk-practice" className="btn-secondary px-6 py-3">
          Bài tập luyện tập
        </Link>
      </div>
    </div>
  );
}
