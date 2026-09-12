import Link from "next/link";

export const metadata = {
  title: "Bài tập luyện HSK | HSKGo",
  description: "Luyện tập HSK qua từ điển, game và bài luyện tập tổng hợp.",
};

const PRACTICE_LINKS = [
  {
    icon: "辞",
    accent: "bg-jade-50 text-jade-600",
    title: "Từ điển tra cứu",
    desc: "Tra hán tự, pinyin hoặc nghĩa tiếng Việt tức thì, không cần đăng nhập.",
    href: "/tools/dictionary",
    cta: "Mở từ điển",
  },
  {
    icon: "🎮",
    accent: "bg-lavender-50 text-lavender-700",
    title: "Game luyện từ vựng",
    desc: "Gõ pinyin tốc độ, nghe đoán chữ — ôn từ vựng thật mà không thấy nhàm chán.",
    href: "/game",
    cta: "Chơi thử",
  },
  {
    icon: "壹",
    accent: "bg-brand-50 text-brand-600",
    title: "Luyện tập tổng hợp",
    desc: "Bài tập theo từng chủ đề, trải dài các cấp độ HSK 1–9.",
    href: "/practice",
    cta: "Bắt đầu luyện",
  },
  {
    icon: "音",
    accent: "bg-gold-50 text-gold-600",
    title: "Ôn tập từ vựng",
    desc: "Ôn lại các từ đã học, tập trung vào những từ hay nhầm lẫn.",
    href: "/vocab/review",
    cta: "Ôn tập ngay",
  },
];

export default function HskPracticePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <p className="text-sm text-ink-400">
        <Link href="/" className="hover:text-brand-600">
          Trang chủ
        </Link>{" "}
        / Bài tập
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink-800 sm:text-3xl">Bài tập luyện HSK</h1>
      <p className="mt-2 max-w-2xl text-ink-500">
        Trang bài tập theo đề riêng của bản gốc chưa có trong bản dựng này. Trong lúc chờ, dùng các
        công cụ luyện tập thật bên dưới — đều đọc/ghi dữ liệu thật từ Postgres.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PRACTICE_LINKS.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="group rounded-2xl border border-ink-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
          >
            <span className={`han flex size-11 items-center justify-center rounded-xl text-xl ${f.accent}`}>
              {f.icon}
            </span>
            <h2 className="mt-4 font-bold text-ink-800">{f.title}</h2>
            <p className="mt-1.5 text-sm text-ink-500">{f.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600">
              {f.cta}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
