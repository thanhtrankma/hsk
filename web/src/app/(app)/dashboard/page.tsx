import Link from "next/link";
import { mockSession, mockWeekStreak } from "@/lib/mock-session";

const STATS = [
  { label: "Bài học đã học", value: 0 },
  { label: "Từ vựng đã học", value: 0 },
  { label: "XP tuần này", value: 0 },
  { label: "Từ thành thạo", value: 0 },
];

export default function DashboardPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <section className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-100">Nâng cao mỗi ngày</p>
          <h1 className="mt-1 text-2xl font-extrabold">Tiến bộ không ngừng!</h1>
          <p className="mt-1 text-brand-100">
            Học tiếng Trung mỗi ngày giúp bạn mở ra những cơ hội mới, {mockSession.displayName}.
          </p>
          <Link
            href="/hsk"
            className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-sm font-bold text-brand-600"
          >
            Bắt đầu học ngay
          </Link>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-5">
          <h2 className="font-bold text-ink-800">Tiếp tục học</h2>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-ink-100" />
            <div className="flex-1">
              <p className="font-bold text-ink-800">Bài 1: Làm quen lần đầu</p>
              <p className="text-sm text-ink-500">Giáo trình HSK 1</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                <div className="h-full w-0 rounded-full bg-brand-500" />
              </div>
            </div>
            <Link
              href="/hsk/1"
              className="rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600"
            >
              Bắt đầu học
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-5">
          <h2 className="font-bold text-ink-800">Thống kê học tập</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-ink-50 p-3 text-center">
                <div className="text-xl font-extrabold text-ink-800">{stat.value}</div>
                <div className="mt-1 text-xs text-ink-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border border-ink-100 bg-white p-5">
          <h2 className="font-bold text-ink-800">🔥 Streak của bạn</h2>
          <p className="mt-2 text-3xl font-extrabold text-brand-600">
            {mockSession.streakDays} <span className="text-base font-semibold text-ink-500">ngày liên tiếp</span>
          </p>
          <div className="mt-4 flex justify-between">
            {mockWeekStreak.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1">
                <div
                  className={`size-8 rounded-full border-2 ${
                    d.done ? "border-brand-500 bg-brand-500" : "border-ink-200"
                  }`}
                />
                <span className="text-[10px] text-ink-400">{d.day}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
            Điểm danh hôm nay
          </button>
        </section>

        <section className="rounded-2xl border border-ink-100 bg-white p-5">
          <h2 className="font-bold text-ink-800">Đối tác & Nhà tài trợ</h2>
          <p className="mt-2 text-sm text-ink-500">
            <Link href="/partners" className="font-bold text-brand-600 hover:underline">
              Trở thành đối tác
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
