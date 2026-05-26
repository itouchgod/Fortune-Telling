import type { LiuYue } from "@/types/bazi";

export default function LiuYueTable({ months }: { months: LiuYue[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">流月列表</h2>
      </div>
      <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((month) => (
          <div key={month.month} className="rounded-md bg-slate-50 p-3">
            <div className="font-medium text-ink">{month.month} 月 · {month.ganZhi}</div>
            <div className="mt-1 text-sm text-jade">{month.tenGod}</div>
            <p className="mt-2 text-sm text-slate-600">{month.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
