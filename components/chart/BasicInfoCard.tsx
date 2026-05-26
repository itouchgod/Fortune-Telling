import type { BaziChart } from "@/types/bazi";

const genderLabel = {
  male: "男",
  female: "女",
  unknown: "未指定"
};

export default function BasicInfoCard({ chart }: { chart: BaziChart }) {
  const info = chart.basicInfo;
  const rows = [
    ["姓名", info.name],
    ["性别", genderLabel[info.gender]],
    ["公历生日", info.solarBirthday],
    ["农历生日", info.lunarBirthday],
    ["出生地", `${info.birthPlace}（${info.longitude}, ${info.latitude}）`],
    ["真太阳时", info.trueSolarTime],
    ["子时规则", info.ziHourRule === "lateZi" ? "晚子时换日" : "早子时换日"]
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">基本信息</h2>
      </div>
      <dl className="panel-body grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
