import Link from "next/link";
import type { BaziChart } from "@/types/bazi";

interface SavedChartCardProps {
  chart: BaziChart;
  onEditNote: (chart: BaziChart) => void;
  onDelete: (id: string) => void;
}

export default function SavedChartCard({ chart, onEditNote, onDelete }: SavedChartCardProps) {
  const pillars = chart.pillars.map((pillar) => pillar.heavenlyStem + pillar.earthlyBranch).join(" ");

  return (
    <article className="rounded-md border border-line bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-ink">{chart.basicInfo.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{pillars}</p>
          <p className="mt-2 text-sm text-slate-500">{chart.note || "暂无备注"}</p>
        </div>
        <span className="w-fit rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{chart.category || "未分类"}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/chart/${chart.id}`} className="focus-ring rounded-md bg-jade px-3 py-2 text-sm text-white">查看详情</Link>
        <button onClick={() => onEditNote(chart)} className="focus-ring rounded-md border border-line px-3 py-2 text-sm">编辑备注</button>
        <button onClick={() => onDelete(chart.id)} className="focus-ring rounded-md border border-line px-3 py-2 text-sm text-cinnabar">删除</button>
      </div>
    </article>
  );
}
