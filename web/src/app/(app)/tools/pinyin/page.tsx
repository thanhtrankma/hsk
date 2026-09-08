import Link from "next/link";
import PinyinConverter from "./PinyinConverter";

export default function PinyinToolPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/tools" className="text-xs font-semibold text-ink-400 hover:text-brand-600">
        ‹ Công cụ
      </Link>
      <h1 className="mt-1 text-2xl font-extrabold text-ink-800">Convert pinyin</h1>
      <p className="mt-1 text-sm text-ink-500">
        Dán văn bản tiếng Trung, nhận lại pinyin có dấu thanh, tô màu theo 5 thanh điệu.
      </p>

      <div className="mt-4">
        <PinyinConverter />
      </div>
    </div>
  );
}
