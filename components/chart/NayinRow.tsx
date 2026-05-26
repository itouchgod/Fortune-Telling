import type { Pillar } from "@/types/bazi";

export default function NayinRow({ pillars, onTermClick }: { pillars: Pillar[]; onTermClick: (term: string) => void }) {
  return (
    <tr>
      <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-600">纳音</th>
      {pillars.map((pillar) => (
        <td key={pillar.type} className="px-3 py-3 text-center">
          <button className="text-sm text-brass hover:underline" onClick={() => onTermClick(pillar.nayin)}>
            {pillar.nayin}
          </button>
        </td>
      ))}
    </tr>
  );
}
