import Link from "next/link";
import { getSectionsSummary } from "@/lib/pages";

export const dynamic = "force-dynamic";

const STATS = [
  { value: "1.253+", label: "Bài học" },
  { value: "10.996+", label: "Từ vựng" },
  { value: "9", label: "Cấp độ HSK" },
  { value: "100%", label: "Miễn phí" },
];

const FEATURES = [
  {
    icon: "壹",
    accent: "bg-brand-50 text-brand-600",
    title: "Lộ trình HSK 1–9",
    desc: "Đi từ người mới bắt đầu đến thành thạo theo từng cấp độ, không bỏ sót kiến thức nào.",
    href: "/hsk",
    cta: "Xem lộ trình",
  },
  {
    icon: "辞",
    accent: "bg-jade-50 text-jade-600",
    title: "Từ điển HSK 5.000+ từ",
    desc: "Tra hán tự, pinyin hoặc nghĩa tiếng Việt tức thì, không cần đăng nhập.",
    href: "/tools/dictionary",
    cta: "Mở từ điển",
  },
  {
    icon: "音",
    accent: "bg-gold-50 text-gold-600",
    title: "Convert pinyin có dấu thanh",
    desc: "Dán bất kỳ đoạn tiếng Trung nào, nhận lại pinyin tô màu theo 5 thanh điệu ngay lập tức.",
    href: "/tools/pinyin",
    cta: "Thử ngay",
  },
  {
    icon: "🎮",
    accent: "bg-lavender-50 text-lavender-700",
    title: "Học qua game",
    desc: "Gõ pinyin tốc độ, nghe đoán chữ — ôn từ vựng thật mà không thấy nhàm chán.",
    href: "/game",
    cta: "Chơi thử",
  },
  {
    icon: "云",
    accent: "bg-brand-50 text-brand-600",
    title: "AI Tutor Mây",
    desc: "Hỏi ngữ pháp, đóng vai tình huống, gửi câu để được sửa — bằng tiếng Việt.",
    href: "/tutor",
    cta: "Trò chuyện",
  },
  {
    icon: "友",
    accent: "bg-jade-50 text-jade-600",
    title: "Bạn bè & cộng đồng",
    desc: "Kết nối với người học khác, cùng nhau giữ động lực học mỗi ngày.",
    href: "/friends",
    cta: "Kết nối",
  },
];

const STEPS = [
  { n: "01", title: "Chọn cấp độ HSK", desc: "Bắt đầu từ HSK 1 nếu mới học, hoặc kiểm tra trình độ để vào đúng cấp." },
  { n: "02", title: "Học theo lộ trình mỗi ngày", desc: "Từ vựng, ngữ pháp, đọc hiểu — chia nhỏ theo bài, học 15 phút mỗi ngày." },
  { n: "03", title: "Ôn tập bằng công cụ & game", desc: "Từ điển, convert pinyin, game luyện từ vựng giúp kiến thức nhớ lâu hơn." },
];

export default async function Home() {
  const sections = await getSectionsSummary();
  const totalPages = sections.reduce((sum, s) => sum + s.count, 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-gold-100/50 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-24 size-72 rounded-full bg-jade-100/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-brand-600 shadow-sm">
              <span className="size-1.5 rounded-full bg-jade-500" /> Miễn phí · Không cần thẻ tín dụng
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-800 sm:text-5xl">
              Học tiếng Trung <span className="text-brand-600">theo cách của người Việt</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-600">
              Lộ trình HSK 1–9, từ điển, công cụ pinyin, game luyện từ vựng và AI Tutor —
              gói gọn trong một nền tảng, giải thích hoàn toàn bằng tiếng Việt.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-600"
              >
                Bắt đầu học miễn phí
              </Link>
              <Link
                href="/hsk"
                className="inline-flex items-center rounded-full border border-ink-200 bg-white px-6 py-3 text-sm font-bold text-ink-700 transition-colors hover:border-brand-300"
              >
                Xem lộ trình HSK
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-4 gap-4 border-t border-ink-100 pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-xl font-extrabold text-ink-800 sm:text-2xl">{s.value}</dd>
                  <p className="mt-0.5 text-xs text-ink-500">{s.label}</p>
                </div>
              ))}
            </dl>
          </div>

          {/* Illustrative product preview (not a real screenshot) */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-red-300" />
                <span className="size-2.5 rounded-full bg-gold-300" />
                <span className="size-2.5 rounded-full bg-jade-300" />
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <span className="han flex size-12 items-center justify-center rounded-full bg-brand-500 text-xl text-white">
                    你
                  </span>
                  <div className="flex-1">
                    <div className="h-2.5 w-24 rounded-full bg-ink-200" />
                    <div className="mt-1.5 h-2 w-16 rounded-full bg-ink-100" />
                  </div>
                  <span className="rounded-full bg-jade-50 px-2 py-1 text-[10px] font-bold text-jade-700">HSK 1</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["好", "谢", "爱"].map((c) => (
                    <div key={c} className="rounded-xl bg-ink-50 p-3 text-center">
                      <span className="han text-2xl text-ink-800">{c}</span>
                      <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-ink-200" />
                    </div>
                  ))}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full w-2/3 rounded-full bg-brand-500" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl bg-brand-500 py-2.5 text-center text-xs font-bold text-white">
                    Tiếp tục học
                  </div>
                  <div className="flex-1 rounded-xl border border-ink-200 py-2.5 text-center text-xs font-bold text-ink-600">
                    Ôn từ vựng
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-ink-100 bg-white p-3 shadow-lg">
              <p className="text-xs font-bold text-ink-500">🔥 Streak</p>
              <p className="text-lg font-extrabold text-brand-600">12 ngày</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-wide text-brand-600 uppercase">Tất cả trong một</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink-800">Mọi công cụ bạn cần để học tiếng Trung</h2>
          <p className="mt-3 text-ink-500">
            Không cần dùng nhiều app cùng lúc — HSKGo gom lộ trình, từ điển, công cụ và luyện tập vào một nơi.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group rounded-2xl border border-ink-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
            >
              <span className={`han flex size-11 items-center justify-center rounded-xl text-xl ${f.accent}`}>
                {f.icon}
              </span>
              <h3 className="mt-4 font-bold text-ink-800">{f.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{f.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600">
                {f.cta}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink-50">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold tracking-wide text-brand-600 uppercase">Bắt đầu trong 3 bước</p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink-800">Học đều mỗi ngày, tiến bộ thấy rõ</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl bg-white p-6">
                <span className="text-3xl font-extrabold text-brand-200">{step.n}</span>
                <h3 className="mt-2 font-bold text-ink-800">{step.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content depth proof */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-ink-800 to-ink-900 px-6 py-12 text-center text-white sm:px-12">
          <p className="text-sm font-bold tracking-wide text-brand-300 uppercase">Kho nội dung</p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            {totalPages.toLocaleString("vi-VN")}+ bài học, chủ đề và bài luyện tập
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-200">
            Từ vựng, ngữ pháp, bài đọc, truyện song ngữ, đề thi thử — trải dài khắp {sections.length} chuyên mục,
            cập nhật liên tục.
          </p>
          <Link
            href="/hsk"
            className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-ink-800 hover:bg-ink-100"
          >
            Khám phá lộ trình HSK
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6">
        <div className="rounded-3xl border border-brand-100 bg-brand-50 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-extrabold text-ink-800 sm:text-3xl">Sẵn sàng bắt đầu chưa?</h2>
          <p className="mx-auto mt-2 max-w-md text-ink-600">
            Tạo tài khoản miễn phí, chọn cấp độ HSK phù hợp và học bài đầu tiên ngay hôm nay.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center rounded-full bg-brand-500 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-600"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </section>
    </div>
  );
}
