import type { BaziChart } from "@/types/bazi";

const calendarLabel = {
  solar: "公历",
  lunar: "农历"
};

const ziHourLabel = {
  earlyZi: "子初换日（23:00 后算次日）",
  lateZi: "子正换日（00:00 后算次日）"
};

export default function CalculationMetaCard({ chart }: { chart: BaziChart }) {
  const meta = chart.calculationMeta;

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">排盘依据</h2>
      </div>
      <div className="panel-body grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Info label="使用历法" value={calendarLabel[meta.calendarUsed]} />
        <Info label="出生时区" value={`${meta.timezone}（${meta.timezoneOffsetLabel ?? `UTC${meta.timezoneOffset >= 0 ? "+" : ""}${meta.timezoneOffset}`}）`} />
        <Info label="夏令时" value={meta.isDst ? "是" : "否"} />
        <Info label="真太阳时" value={meta.trueSolarTimeUsed ? meta.trueSolarTime : "未使用"} />
        <Info label="均时差" value={`${Number(meta.equationOfTimeMinutes ?? 0).toFixed(2)} 分钟`} />
        <Info label="子时规则" value={ziHourLabel[meta.ziHourRule]} />
        <Info label="年柱规则" value={meta.yearPillarRule} />
        <Info label="月柱规则" value={meta.monthPillarRule} />
        <Info label="节气规则" value={meta.solarTermUsed ? "已启用" : "未启用"} />
        <Info label="引擎版本" value={meta.engineVersion} />
        {meta.warnings.length > 0 && (
          <div className="rounded-md bg-brass/10 px-3 py-2 sm:col-span-2 lg:col-span-3">
            <div className="text-xs text-brass">警告信息</div>
            <ul className="mt-1 grid gap-1 text-sm text-slate-700">
              {meta.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}
