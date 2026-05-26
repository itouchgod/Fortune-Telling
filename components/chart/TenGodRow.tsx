import type { Pillar } from "@/types/bazi";

export default function TenGodRow({ pillars, onTermClick }: { pillars: Pillar[]; onTermClick: (term: string) => void }) {
  return (
    <tr>
      <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-600">十神</th>
      {pillars.map((pillar) => (
        <td key={pillar.type} className="px-3 py-3 text-center">
          <button className="rounded bg-jade/10 px-2 py-1 text-sm text-jade" onClick={() => onTermClick(pillar.tenGod)}>
            {pillar.tenGod}
          </button>
        </td>
      ))}
    </tr>
  );
}
