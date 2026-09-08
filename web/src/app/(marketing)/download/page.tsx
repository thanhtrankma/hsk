import Link from "next/link";

export const metadata = {
  title: "Tải ứng dụng | HSKGo",
  description: "Ứng dụng di động HSKGo đang được phát triển.",
};

export default function DownloadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
        ỨNG DỤNG DI ĐỘNG
      </span>
      <h1 className="mt-3 text-2xl font-extrabold text-ink-800 sm:text-3xl">
        Ứng dụng di động đang được phát triển
      </h1>
      <p className="mt-3 text-ink-500">
        HSKGo hiện chỉ có bản web. Ứng dụng iOS/Android cho phép học offline và đồng bộ tiến độ
        đang được lên kế hoạch — quay lại đây sau nhé.
      </p>
      <Link
        href="/hsk"
        className="mt-6 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600"
      >
        Học ngay trên web
      </Link>
    </div>
  );
}
