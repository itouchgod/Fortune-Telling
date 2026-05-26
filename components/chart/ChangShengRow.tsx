import type { Pillar } from "@/types/bazi";

export default function ChangShengRow({ pillars, onTermClick }: { pillars: Pillar[]; onTermClick: (term: string) => void }) {
  return (
    <tr>
      <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-600">十二长生</th>
      {pillars.map((pillar) => (
        <td key={pillar.type} className="px-3 py-3 text-center">
          <button className="text-sm text-slate-700 hover:text-jade" onClick={() => onTermClick(pillar.changSheng)}>
            {pillar.changSheng}
          </button>
        </td>
      ))}
    </tr>
  );
}
