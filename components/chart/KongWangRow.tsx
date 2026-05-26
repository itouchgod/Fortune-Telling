import type { Pillar } from "@/types/bazi";

export default function KongWangRow({ pillars }: { pillars: Pillar[] }) {
  return (
    <tr>
      <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-600">空亡</th>
      {pillars.map((pillar) => (
        <td key={pillar.type} className="px-3 py-3 text-center text-sm text-slate-700">
          {pillar.kongWang}
        </td>
      ))}
    </tr>
  );
}
