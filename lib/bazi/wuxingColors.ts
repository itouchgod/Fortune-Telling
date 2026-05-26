import { BRANCH_WUXING, STEM_WUXING } from "@/lib/bazi/ganzhi";
import type { WuXingItem } from "@/types/bazi";

/** 五行文字色（内联样式，避免 Tailwind 动态类被裁剪） */
export const WUXING_COLOR_HEX: Record<WuXingItem["name"], string> = {
  金: "#b8860b",
  木: "#2e7d4f",
  水: "#1d5f8a",
  火: "#c0392b",
  土: "#9a6b1a"
};

/** 供 Tailwind 扫描保留（若改用 className 时可用） */
export const WUXING_TEXT_CLASS: Record<WuXingItem["name"], string> = {
  金: "text-wuxing-metal",
  木: "text-wuxing-wood",
  水: "text-wuxing-water",
  火: "text-wuxing-fire",
  土: "text-wuxing-earth"
};

export function getWuXingForStem(stem: string): WuXingItem["name"] | undefined {
  return STEM_WUXING[stem];
}

export function getWuXingForBranch(branch: string): WuXingItem["name"] | undefined {
  return BRANCH_WUXING[branch];
}

export function getWuXingColorForStem(stem: string) {
  const element = getWuXingForStem(stem);
  return element ? WUXING_COLOR_HEX[element] : undefined;
}

export function getWuXingColorForBranch(branch: string) {
  const element = getWuXingForBranch(branch);
  return element ? WUXING_COLOR_HEX[element] : undefined;
}

export function getWuXingTextClassForStem(stem: string) {
  const element = getWuXingForStem(stem);
  return element ? WUXING_TEXT_CLASS[element] : "text-ink";
}

export function getWuXingTextClassForBranch(branch: string) {
  const element = getWuXingForBranch(branch);
  return element ? WUXING_TEXT_CLASS[element] : "text-ink";
}
