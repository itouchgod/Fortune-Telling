export const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

export const STEM_WUXING: Record<string, "木" | "火" | "土" | "金" | "水"> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水"
};

export const BRANCH_WUXING: Record<string, "木" | "火" | "土" | "金" | "水"> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水"
};

export const HIDDEN_STEMS: Record<string, string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"]
};

export function nextGanZhi(ganZhi: string, offset: number) {
  const gan = ganZhi.slice(0, 1);
  const zhi = ganZhi.slice(1, 2);
  const ganIndex = HEAVENLY_STEMS.indexOf(gan);
  const zhiIndex = EARTHLY_BRANCHES.indexOf(zhi);
  if (ganIndex < 0 || zhiIndex < 0) return ganZhi;
  return `${HEAVENLY_STEMS[(ganIndex + offset + 1000) % 10]}${EARTHLY_BRANCHES[(zhiIndex + offset + 1200) % 12]}`;
}

export function splitGanZhi(ganZhi: string) {
  return {
    gan: ganZhi.slice(0, 1),
    zhi: ganZhi.slice(1, 2)
  };
}
