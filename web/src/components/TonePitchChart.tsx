// Renders the "5 → 5" / "2 → 1 → 4" style pitch-contour notation as a small
// line chart instead of raw text -- the shape communicates the tone far
// faster than the numbers do.
export default function TonePitchChart({ contour }: { contour: string }) {
  const points = contour
    .split("→")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
  if (points.length < 2) return null;

  const w = 72;
  const h = 40;
  const pad = 6;
  const coords = points.map((v, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - 1) / 4) * (h - pad * 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-[72px] shrink-0 overflow-hidden">
      {[1, 2, 3, 4, 5].map((v) => (
        <line
          key={v}
          x1={pad}
          x2={w - pad}
          y1={pad + (1 - (v - 1) / 4) * (h - pad * 2)}
          y2={pad + (1 - (v - 1) / 4) * (h - pad * 2)}
          stroke="var(--color-ink-100)"
          strokeWidth={1}
        />
      ))}
      <polyline points={coords.join(" ")} fill="none" stroke="var(--color-brand-500)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => {
        const [x, y] = c.split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r={2.5} fill="var(--color-brand-500)" />;
      })}
    </svg>
  );
}
