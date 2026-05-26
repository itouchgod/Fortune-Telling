import GanZhiText, { GanZhiPairText } from "@/components/chart/GanZhiText";
import type { Pillar } from "@/types/bazi";

const pillarLabels = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱"
};

export default function PillarColumn({ pillar }: { pillar: Pillar }) {
  return (
    <div className="grid min-w-24 gap-2 text-center">
      <div className="rounded-md bg-ink px-2 py-2 text-sm font-medium text-white">{pillarLabels[pillar.type]}</div>
      <div className="rounded-md border border-line bg-white px-2 py-3">
        <GanZhiText char={pillar.heavenlyStem} kind="stem" className="text-3xl font-semibold" />
        <GanZhiText char={pillar.earthlyBranch} kind="branch" className="mt-2 block text-3xl font-semibold" />
        <GanZhiPairText
          stem={pillar.heavenlyStem}
          branch={pillar.earthlyBranch}
          className="mt-2 block text-xs opacity-70"
        />
      </div>
    </div>
  );
}
