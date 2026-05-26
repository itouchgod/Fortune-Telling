import type { Pillar } from "@/types/bazi";

export default function HiddenStemRow({ pillars, onTermClick }: { pillars: Pillar[]; onTermClick: (term: string) => void }) {
  return (
    <tr>
      <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-600">藏干</th>
      {pillars.map((pillar) => (
        <td key={pillar.type} className="px-3 py-3 align-top">
          <div className="flex flex-col items-center gap-1">
            {pillar.hiddenStems.map((item) => (
              <button
                key={`${pillar.type}-${item.stem}-${item.tenGod}`}
                className="text-sm text-slate-700 hover:text-jade"
                onClick={() => onTermClick(item.tenGod)}
              >
                {item.stem} · {item.tenGod} · {item.weight}
              </button>
            ))}
          </div>
        </td>
      ))}
    </tr>
  );
}
