import type { BaziChart } from "@/types/bazi";
import PillarColumn from "@/components/chart/PillarColumn";
import TenGodRow from "@/components/chart/TenGodRow";
import HiddenStemRow from "@/components/chart/HiddenStemRow";
import NayinRow from "@/components/chart/NayinRow";
import KongWangRow from "@/components/chart/KongWangRow";
import ChangShengRow from "@/components/chart/ChangShengRow";

export default function BaziPlate({ chart, onTermClick }: { chart: BaziChart; onTermClick: (term: string) => void }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">四柱命盘</h2>
      </div>
      <div className="panel-body grid gap-5">
        <div className="grid grid-cols-4 gap-3 overflow-x-auto">
          {chart.pillars.map((pillar) => (
            <PillarColumn key={pillar.type} pillar={pillar} />
          ))}
        </div>

        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left font-medium text-slate-600">项目</th>
                <th className="px-3 py-3 font-medium">年柱</th>
                <th className="px-3 py-3 font-medium">月柱</th>
                <th className="px-3 py-3 font-medium">日柱</th>
                <th className="px-3 py-3 font-medium">时柱</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <TenGodRow pillars={chart.pillars} onTermClick={onTermClick} />
              <tr>
                <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-600">天干</th>
                {chart.pillars.map((pillar) => <td key={pillar.type} className="px-3 py-3 text-center text-lg font-semibold text-cinnabar">{pillar.heavenlyStem}</td>)}
              </tr>
              <tr>
                <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-600">地支</th>
                {chart.pillars.map((pillar) => <td key={pillar.type} className="px-3 py-3 text-center text-lg font-semibold text-jade">{pillar.earthlyBranch}</td>)}
              </tr>
              <HiddenStemRow pillars={chart.pillars} onTermClick={onTermClick} />
              <NayinRow pillars={chart.pillars} onTermClick={onTermClick} />
              <KongWangRow pillars={chart.pillars} />
              <ChangShengRow pillars={chart.pillars} onTermClick={onTermClick} />
              <tr>
                <th className="sticky left-0 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-600">神煞</th>
                {chart.pillars.map((pillar) => (
                  <td key={pillar.type} className="px-3 py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {pillar.shenSha.map((item) => (
                        <button key={item} onClick={() => onTermClick(item)} className="rounded bg-slate-100 px-2 py-1 text-xs hover:text-jade">
                          {item}
                        </button>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
