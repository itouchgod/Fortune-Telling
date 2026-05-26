import type { LuckCycle } from "@/types/bazi";

export default function DaYunTimeline({
  cycles,
  activeIndex,
  onSelect
}: {
  cycles: LuckCycle[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">十年大运</h2>
      </div>
      <div className="panel-body flex gap-3 overflow-x-auto">
        {cycles.map((cycle, index) => (
          <button
            key={`${cycle.startYear}-${cycle.pillar}`}
            onClick={() => onSelect(index)}
            className={`min-w-36 rounded-md border px-4 py-3 text-left transition ${
              activeIndex === index ? "border-jade bg-jade text-white" : "border-line bg-white hover:border-jade"
            }`}
          >
            <div className="text-lg font-semibold">{cycle.pillar}</div>
            <div className="mt-1 text-sm opacity-90">{cycle.tenGod}</div>
            <div className="mt-2 text-xs opacity-80">{cycle.startYear} 起 · {cycle.startAge} 岁</div>
          </button>
        ))}
      </div>
    </section>
  );
}
