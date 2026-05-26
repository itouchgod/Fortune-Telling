import type { Pillar } from "@/types/bazi";

export default function ShenShaPanel({ pillars, onTermClick }: { pillars: Pillar[]; onTermClick: (term: string) => void }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">神煞</h2>
      </div>
      <div className="panel-body grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => (
          <div key={pillar.type} className="rounded-md bg-slate-50 p-3">
            <div className="text-sm font-medium text-slate-700">{pillar.heavenlyStem + pillar.earthlyBranch}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {pillar.shenSha.map((item) => (
                <button
                  key={`${pillar.type}-${item}`}
                  onClick={() => onTermClick(item)}
                  className="rounded bg-white px-2 py-1 text-xs text-slate-700 ring-1 ring-line hover:text-jade"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
