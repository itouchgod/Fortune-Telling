import type { Pillar } from "@/types/bazi";

const TIAN_YI: Record<string, string[]> = {
  甲: ["丑", "未"],
  戊: ["丑", "未"],
  庚: ["丑", "未"],
  乙: ["子", "申"],
  己: ["子", "申"],
  丙: ["亥", "酉"],
  丁: ["亥", "酉"],
  壬: ["卯", "巳"],
  癸: ["卯", "巳"],
  辛: ["寅", "午"]
};

const WEN_CHANG: Record<string, string> = {
  甲: "巳",
  乙: "午",
  丙: "申",
  丁: "酉",
  戊: "申",
  己: "酉",
  庚: "亥",
  辛: "子",
  壬: "寅",
  癸: "卯"
};

export function buildShenSha(pillars: Pillar[], dayStem: string) {
  const tianYiBranches = TIAN_YI[dayStem] ?? [];
  const wenChangBranch = WEN_CHANG[dayStem];

  return pillars.map((pillar) => {
    const stars = new Set<string>();
    if (tianYiBranches.includes(pillar.earthlyBranch)) stars.add("天乙贵人");
    if (wenChangBranch === pillar.earthlyBranch) stars.add("文昌");
    if (pillar.type === "day") stars.add("日主");
    if (["申", "寅", "巳", "亥"].includes(pillar.earthlyBranch)) stars.add("驿马");
    if (["辰", "戌", "丑", "未"].includes(pillar.earthlyBranch)) stars.add("华盖");
    return { ...pillar, shenSha: Array.from(stars) };
  });
}
