import type { BaziChart } from "@/types/bazi";

export default function WuXingChart({ chart }: { chart: BaziChart }) {
  const max = Math.max(...chart.wuXing.map((item) => item.count), 1);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">五行分析</h2>
      </div>
      <div className="panel-body grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-3">
          {chart.wuXing.map((item) => (
            <div key={item.name} className="grid grid-cols-[32px_1fr_56px] items-center gap-3">
              <span className="text-sm font-medium">{item.name}</span>
              <div className="h-3 overflow-hidden rounded bg-slate-100">
                <div className="h-full rounded bg-jade" style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
              <span className="text-right text-sm text-slate-600">{item.count} · {item.strength}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-3 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <div><span className="font-medium text-ink">日主：</span>{chart.dayMaster}</div>
          <div><span className="font-medium text-ink">强弱：</span>{chart.strength}</div>
          <div><span className="font-medium text-ink">取用参考：</span>{chart.usefulGods.join("、")}</div>
        </div>
      </div>
    </section>
  );
}
