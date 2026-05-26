import type { LiuNian } from "@/types/bazi";

export default function LiuNianTable({ years }: { years: LiuNian[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">流年列表</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">年份</th>
              <th className="px-4 py-3 font-medium">年龄</th>
              <th className="px-4 py-3 font-medium">干支</th>
              <th className="px-4 py-3 font-medium">十神</th>
              <th className="px-4 py-3 font-medium">合冲刑害</th>
              <th className="px-4 py-3 font-medium">备注</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {years.map((year) => (
              <tr key={year.year}>
                <td className="px-4 py-3">{year.year}</td>
                <td className="px-4 py-3">{year.age}</td>
                <td className="px-4 py-3 font-medium">{year.ganZhi}</td>
                <td className="px-4 py-3">{year.tenGod}</td>
                <td className="px-4 py-3">{year.relations.map((item) => item.description).join("、") || "无明显关系"}</td>
                <td className="px-4 py-3 text-slate-600">{year.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
