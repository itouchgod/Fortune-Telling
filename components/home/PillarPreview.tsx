import GanZhiText, { GanZhiPairText } from "@/components/chart/GanZhiText";
import type { CurrentPlateSnapshot } from "@/lib/bazi/currentPlate";
import type { PillarLayout, PlateDisplayMode } from "@/types/bazi";

const pillarUnits = ["年", "月", "日", "时"] as const;

interface PillarPreviewProps {
  snapshot: CurrentPlateSnapshot;
  layout: PillarLayout;
  displayMode: PlateDisplayMode;
}

export default function PillarPreview({ snapshot, layout, displayMode }: PillarPreviewProps) {
  const pillars = [
    [snapshot.yearStem, snapshot.yearBranch],
    [snapshot.monthStem, snapshot.monthBranch],
    [snapshot.dayStem, snapshot.dayBranch],
    [snapshot.hourStem, snapshot.hourBranch]
  ] as const;

  if (layout === "horizontal") {
    return (
      <div className="space-y-2">
        {displayMode === "standard" && <p className="text-center text-sm text-jade">{snapshot.jieLabel}</p>}
        <div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-3 text-center">
          {pillars.map(([stem, branch], index) => (
            <div key={pillarUnits[index]} className="inline-flex items-end gap-1">
              <GanZhiText char={stem} kind="stem" className="text-3xl font-semibold tracking-wide md:text-4xl" />
              <GanZhiText char={branch} kind="branch" className="text-3xl font-semibold tracking-wide md:text-4xl" />
              <span className="pb-1 text-sm font-normal text-slate-500">{pillarUnits[index]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayMode === "standard" && <p className="text-center text-sm text-jade">{snapshot.jieLabel}</p>}
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2 md:gap-3">
        {pillars.map(([stem, branch], index) => (
          <div key={pillarUnits[index]} className="text-center">
            <div className="mb-2 text-xs font-medium text-slate-500">{pillarUnits[index]}柱</div>
            <div className="rounded-md border border-line bg-white px-2 py-3">
              <GanZhiText char={stem} kind="stem" className="block text-3xl font-semibold leading-none md:text-4xl" />
              <GanZhiText char={branch} kind="branch" className="mt-3 block text-3xl font-semibold leading-none md:text-4xl" />
              {displayMode === "standard" && (
                <GanZhiPairText stem={stem} branch={branch} className="mt-2 block text-xs opacity-80" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
