import { mockSession, mockBadges } from "@/lib/mock-session";

export default function ProfilePage() {
  const s = mockSession;
  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-extrabold text-brand-700">
          {s.displayName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-ink-800">{s.displayName}</h1>
            {s.membership === "premium" && (
              <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-bold text-gold-700">
                Premium
              </span>
            )}
          </div>
          <p className="text-sm text-ink-500">
            {s.levelLabel} · Tham gia {s.joinedLabel}
          </p>
          <div className="mt-2 h-2 w-full max-w-xs overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${s.overallProgressPct}%` }} />
          </div>
        </div>
        <button className="rounded-full border border-ink-200 px-4 py-2 text-sm font-bold text-ink-700 hover:bg-ink-50">
          Cài đặt
        </button>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-4 text-center">
          <div className="text-xl font-extrabold text-ink-800">0</div>
          <div className="text-xs text-ink-500">XP tuần này</div>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4 text-center">
          <div className="text-xl font-extrabold text-ink-800">{s.xpTotal}</div>
          <div className="text-xs text-ink-500">XP toàn thời gian</div>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-4 text-center">
          <div className="text-xl font-extrabold text-ink-800">
            {mockBadges.filter((b) => b.unlocked).length}/{mockBadges.length}
          </div>
          <div className="text-xs text-ink-500">Huy hiệu mở khoá</div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-100 bg-white p-5">
        <h2 className="font-bold text-ink-800">Thành tựu</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {mockBadges.map((badge) => (
            <div
              key={badge.title}
              className={`rounded-xl border p-4 text-center ${
                badge.unlocked ? "border-gold-300 bg-gold-50" : "border-ink-100 bg-ink-50/50 opacity-60"
              }`}
            >
              <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full bg-white text-lg">
                {badge.unlocked ? "🏆" : "🔒"}
              </div>
              <p className="text-sm font-bold text-ink-800">{badge.title}</p>
              <p className="mt-1 text-xs text-ink-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
