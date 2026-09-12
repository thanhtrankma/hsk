import AudioButton from "./AudioButton";
import TonePitchChart from "./TonePitchChart";

export type AudioEntry = {
  group: string | null;
  label: string;
  cells: string[];
  headers: string[] | null;
  file: string;
};

// Real recorded pronunciation audio (downloaded once via
// scraper/capture_cge_audio.py, per explicit confirmation from that
// content's owner), grouped and labeled the same way the source organizes
// it pedagogically (e.g. initials by place of articulation, finals by
// mouth shape, rules by rule number) so students can study one group at a
// time instead of a flat wall of cards.

const ACCENTS = [
  { bar: "bg-brand-500", chip: "bg-brand-50 text-brand-700" },
  { bar: "bg-jade-500", chip: "bg-jade-50 text-jade-700" },
  { bar: "bg-gold-500", chip: "bg-gold-50 text-gold-700" },
  { bar: "bg-lavender-700", chip: "bg-lavender-100 text-lavender-700" },
];

function isAudioColumn(header: string) {
  return /nghe/i.test(header);
}

function isPitchColumn(header: string) {
  return /cao độ/i.test(header);
}

function PhonemeCard({ entry }: { entry: AudioEntry }) {
  const fields = entry.cells
    .map((value, i) => ({ header: entry.headers?.[i], value: value.trim() }))
    .filter((f, i) => i > 0 && f.value && f.header && !isAudioColumn(f.header));

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md">
      <AudioButton src={`/audio/cge/${entry.file}`} />
      <div className="min-w-0 flex-1">
        <p className="han text-base leading-tight font-bold text-ink-800">{entry.label}</p>
        {fields.length > 0 && (
          <dl className="mt-2 space-y-1.5">
            {fields.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {f.header && isPitchColumn(f.header) ? (
                  <>
                    <dt className="shrink-0 pt-1 font-semibold text-ink-400">{f.header}</dt>
                    <dd className="flex items-center gap-2 text-ink-600">
                      <TonePitchChart contour={f.value} />
                      <span>{f.value}</span>
                    </dd>
                  </>
                ) : (
                  <>
                    <dt className="shrink-0 font-semibold whitespace-nowrap text-ink-400">{f.header}:</dt>
                    <dd className="text-ink-600">{f.value}</dd>
                  </>
                )}
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

function groupEntries(entries: AudioEntry[]): [string, AudioEntry[]][] {
  const map = new Map<string, AudioEntry[]>();
  for (const entry of entries) {
    const key = entry.group || "Khác";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return [...map.entries()];
}

export default function AudioManifestSection({ entries }: { entries: AudioEntry[] }) {
  const groups = groupEntries(entries);
  return (
    <div className="mt-6 space-y-10">
      {groups.map(([title, items], i) => {
        const accent = ACCENTS[i % ACCENTS.length];
        return (
          <div key={title}>
            <div className="flex items-center gap-3">
              <span className={`h-6 w-1.5 shrink-0 rounded-full ${accent.bar}`} />
              <h3 className="text-sm font-extrabold text-ink-800 sm:text-base">{title}</h3>
              <span className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${accent.chip}`}>
                {items.length}
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((entry, j) => (
                <PhonemeCard key={j} entry={entry} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
