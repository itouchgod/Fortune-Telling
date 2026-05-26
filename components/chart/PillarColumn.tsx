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
        <div className="text-3xl font-semibold text-cinnabar">{pillar.heavenlyStem}</div>
        <div className="mt-2 text-3xl font-semibold text-jade">{pillar.earthlyBranch}</div>
        <div className="mt-2 text-xs text-slate-500">{pillar.heavenlyStem + pillar.earthlyBranch}</div>
      </div>
    </div>
  );
}
