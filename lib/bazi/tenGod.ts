import { HEAVENLY_STEMS, STEM_WUXING } from "@/lib/bazi/ganzhi";

const GENERATES: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木"
};

const CONTROLS: Record<string, string> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木"
};

export function isYangStem(stem: string) {
  return HEAVENLY_STEMS.indexOf(stem) % 2 === 0;
}

export function getTenGod(dayStem: string, targetStem: string) {
  if (dayStem === targetStem) return "比肩";
  const dayElement = STEM_WUXING[dayStem];
  const targetElement = STEM_WUXING[targetStem];
  if (!dayElement || !targetElement) return "未知";

  const samePolarity = isYangStem(dayStem) === isYangStem(targetStem);

  if (targetElement === dayElement) return samePolarity ? "比肩" : "劫财";
  if (GENERATES[dayElement] === targetElement) return samePolarity ? "食神" : "伤官";
  if (GENERATES[targetElement] === dayElement) return samePolarity ? "偏印" : "正印";
  if (CONTROLS[dayElement] === targetElement) return samePolarity ? "偏财" : "正财";
  if (CONTROLS[targetElement] === dayElement) return samePolarity ? "七杀" : "正官";

  return "未知";
}
