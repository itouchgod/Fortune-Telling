const availableFeatures = [
  "四柱、十神、藏干、纳音、空亡、长生、神煞",
  "五行统计、日主强弱、排盘依据",
  "大运流年、原局关系、流年关系",
  "术语词典、命盘保存与备注"
];

const upcomingFeatures = ["AI 分析", "PDF / 图片导出"];

export default function HomeFeatureSections() {
  return (
    <div className="mt-4 grid gap-4">
      <section>
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">已开放</h3>
        <ul className="mt-2 grid gap-2">
          {availableFeatures.map((item) => (
            <li key={item} className="rounded-md border border-line bg-white px-3 py-2 text-sm text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">即将开放</h3>
        <ul className="mt-2 grid gap-2">
          {upcomingFeatures.map((item) => (
            <li
              key={item}
              className="rounded-md border border-dashed border-line bg-slate-50 px-3 py-2 text-sm text-slate-500"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
