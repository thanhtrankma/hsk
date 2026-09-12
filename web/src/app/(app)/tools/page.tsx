import Link from "next/link";

const TOOLS = [
  {
    href: "/tools/dictionary",
    icon: "辞",
    title: "Từ điển HSK",
    desc: "Tra hơn 5.000 từ theo hanzi, pinyin hoặc nghĩa tiếng Việt.",
  },
  {
    href: "/tools/pinyin",
    icon: "音",
    title: "Convert pinyin",
    desc: "Dán văn bản tiếng Trung → ra pinyin có dấu thanh, tô màu theo thanh điệu.",
  },
  {
    href: "/tools/writing",
    icon: "写",
    title: "Luyện viết chữ Hán",
    desc: "Xem hoạt hình thứ tự nét hoặc tự vẽ để đố vui, cho bất kỳ chữ nào.",
  },
];

export default function ToolsHubPage() {
  return (
    <div>
      <span className="inline-flex items-center rounded-full bg-jade-50 px-3 py-1 text-xs font-bold text-jade-700">
        CÔNG CỤ
      </span>
      <h1 className="mt-2 text-2xl font-extrabold text-ink-800">Bộ công cụ học tiếng Trung</h1>
      <p className="mt-1 text-sm text-ink-500">Tra từ điển, convert pinyin — miễn phí.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-2xl border border-ink-100 bg-white p-5 transition-colors hover:border-brand-300"
          >
            <span className="han flex size-10 items-center justify-center rounded-xl bg-ink-100 text-xl text-ink-700">
              {tool.icon}
            </span>
            <h2 className="mt-3 font-bold text-ink-800">{tool.title}</h2>
            <p className="mt-1 text-sm text-ink-500">{tool.desc}</p>
            <span className="mt-3 inline-block text-sm font-bold text-brand-600">Mở công cụ →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
