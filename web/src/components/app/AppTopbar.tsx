import { mockSession } from "@/lib/mock-session";

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center px-3 text-center">
      <span className="text-sm font-extrabold text-ink-800">{value}</span>
      <span className="text-[10px] font-semibold text-ink-400">{label}</span>
    </div>
  );
}

export default function AppTopbar() {
  const s = mockSession;
  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink-100 bg-white px-4 py-2.5 sm:px-6">
      <div className="flex items-center divide-x divide-ink-100">
        <StatChip label={s.currentHsk} value={s.currentHsk} />
        <StatChip label="Streak" value={`${s.streakDays} ngày`} />
        <StatChip label="XP" value={String(s.xpTotal)} />
        <StatChip label="Tim" value={s.hearts} />
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-bold text-ink-600">
          {s.membership === "premium" ? "Premium" : "Miễn phí"}
        </span>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
            {s.displayName.charAt(0)}
          </span>
          <div className="text-left leading-tight">
            <div className="text-sm font-bold text-ink-800">{s.displayName}</div>
            <div className="text-[11px] text-ink-400">{s.levelLabel}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
