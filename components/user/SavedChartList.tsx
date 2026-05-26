import type { BaziChart } from "@/types/bazi";
import SavedChartCard from "@/components/user/SavedChartCard";

interface SavedChartListProps {
  charts: BaziChart[];
  onEditNote: (chart: BaziChart) => void;
  onDelete: (id: string) => void;
}

export default function SavedChartList({ charts, onEditNote, onDelete }: SavedChartListProps) {
  if (charts.length === 0) {
    return <div className="rounded-md border border-dashed border-line p-8 text-center text-sm text-slate-500">暂无保存命盘</div>;
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {charts.map((chart) => (
        <SavedChartCard key={chart.id} chart={chart} onEditNote={onEditNote} onDelete={onDelete} />
      ))}
    </div>
  );
}
