import type { Pillar, WuXingItem } from "@/types/bazi";
import { BRANCH_WUXING, STEM_WUXING } from "@/lib/bazi/ganzhi";

const WUXING_ORDER: WuXingItem["name"][] = ["金", "木", "水", "火", "土"];

export function buildWuXing(pillars: Pillar[]): WuXingItem[] {
  const counts = WUXING_ORDER.reduce<Record<WuXingItem["name"], number>>((acc, item) => {
    acc[item] = 0;
    return acc;
  }, {} as Record<WuXingItem["name"], number>);

  pillars.forEach((pillar) => {
    const stemElement = STEM_WUXING[pillar.heavenlyStem];
    const branchElement = BRANCH_WUXING[pillar.earthlyBranch];
    if (stemElement) counts[stemElement] += 1;
    if (branchElement) counts[branchElement] += 1;
    pillar.hiddenStems.forEach((item) => {
      const hiddenElement = STEM_WUXING[item.stem];
      if (hiddenElement) counts[hiddenElement] += item.weight === "主气" ? 0.6 : item.weight === "中气" ? 0.3 : 0.1;
    });
  });

  return WUXING_ORDER.map((name) => ({
    name,
    count: Number(counts[name].toFixed(1)),
    strength: counts[name] >= 3 ? "偏旺" : counts[name] <= 1 ? "偏弱" : "平衡"
  }));
}

export function describeDayMaster(dayMaster: string, wuXing: WuXingItem[]) {
  const element = dayMaster.slice(1, 2) as WuXingItem["name"];
  const item = wuXing.find((entry) => entry.name === element);
  if (!item) return "日主强弱待进一步结合月令与格局判断。";
  return `日主${dayMaster}，当前五行计数显示${element}为${item.strength}，需结合月令、通根、透干继续细判。`;
}

export function inferUsefulGods(dayMaster: string, wuXing: WuXingItem[]) {
  const element = dayMaster.slice(1, 2);
  const current = wuXing.find((item) => item.name === element);
  if (!current) return ["待定"];
  if (current.strength === "偏旺") {
    return wuXing.filter((item) => item.strength === "偏弱").map((item) => item.name).slice(0, 2);
  }
  if (current.strength === "偏弱") {
    return [element, "印星"].filter(Boolean);
  }
  return ["平衡取用待定"];
}
