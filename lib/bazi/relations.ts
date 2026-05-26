import type { BaziRelation, Pillar } from "@/types/bazi";

const STEM_COMBINATIONS = [["甲", "己"], ["乙", "庚"], ["丙", "辛"], ["丁", "壬"], ["戊", "癸"]];
const BRANCH_COMBINATIONS = [["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"]];
const BRANCH_CLASHES = [["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"]];
const BRANCH_HARMS = [["子", "未"], ["丑", "午"], ["寅", "巳"], ["卯", "辰"], ["申", "亥"], ["酉", "戌"]];
const BRANCH_BREAKS = [["子", "酉"], ["丑", "辰"], ["寅", "亥"], ["卯", "午"], ["巳", "申"], ["未", "戌"]];
const BRANCH_PUNISHMENTS = [["子", "卯"], ["寅", "巳"], ["巳", "申"], ["寅", "申"], ["丑", "戌"], ["戌", "未"], ["丑", "未"]];
const SELF_PUNISHMENTS = ["辰", "午", "酉", "亥"];

export function buildNatalRelations(pillars: Pillar[]): BaziRelation[] {
  const relations: BaziRelation[] = [];
  for (let i = 0; i < pillars.length; i += 1) {
    for (let j = i + 1; j < pillars.length; j += 1) {
      relations.push(...compareGanZhi(labelPillar(pillars[i]), pillars[i].heavenlyStem, pillars[i].earthlyBranch, labelPillar(pillars[j]), pillars[j].heavenlyStem, pillars[j].earthlyBranch));
    }
  }
  return uniqueRelations(relations);
}

export function buildRelationsWithNatal(targetLabel: string, targetGanZhi: string, natalPillars: Pillar[]): BaziRelation[] {
  const targetGan = targetGanZhi.slice(0, 1);
  const targetZhi = targetGanZhi.slice(1, 2);
  return uniqueRelations(
    natalPillars.flatMap((pillar) =>
      compareGanZhi(targetLabel, targetGan, targetZhi, labelPillar(pillar), pillar.heavenlyStem, pillar.earthlyBranch)
    )
  );
}

function compareGanZhi(sourceLabel: string, sourceGan: string, sourceZhi: string, targetLabel: string, targetGan: string, targetZhi: string): BaziRelation[] {
  const relations: BaziRelation[] = [];
  if (hasPair(STEM_COMBINATIONS, sourceGan, targetGan)) relations.push(relation("天干五合", sourceLabel, targetLabel, `${sourceGan}${targetGan}合`));
  if (hasPair(BRANCH_COMBINATIONS, sourceZhi, targetZhi)) relations.push(relation("地支六合", sourceLabel, targetLabel, `${sourceZhi}${targetZhi}合`));
  if (hasPair(BRANCH_CLASHES, sourceZhi, targetZhi)) relations.push(relation("地支六冲", sourceLabel, targetLabel, `${sourceZhi}${targetZhi}冲`));
  if (hasPair(BRANCH_HARMS, sourceZhi, targetZhi)) relations.push(relation("地支六害", sourceLabel, targetLabel, `${sourceZhi}${targetZhi}害`));
  if (hasPair(BRANCH_BREAKS, sourceZhi, targetZhi)) relations.push(relation("地支相破", sourceLabel, targetLabel, `${sourceZhi}${targetZhi}破`));
  if (hasPair(BRANCH_PUNISHMENTS, sourceZhi, targetZhi) || (sourceZhi === targetZhi && SELF_PUNISHMENTS.includes(sourceZhi))) {
    relations.push(relation("地支相刑", sourceLabel, targetLabel, sourceZhi === targetZhi ? `${sourceZhi}${targetZhi}自刑` : `${sourceZhi}${targetZhi}刑`));
  }
  return relations;
}

function relation(type: BaziRelation["type"], source: string, target: string, description: string): BaziRelation {
  return { type, source, target, description };
}

function hasPair(pairs: string[][], a: string, b: string) {
  return pairs.some(([left, right]) => (left === a && right === b) || (left === b && right === a));
}

function labelPillar(pillar: Pillar) {
  const labels = { year: "年柱", month: "月柱", day: "日柱", hour: "时柱" };
  return `${labels[pillar.type]}${pillar.heavenlyStem}${pillar.earthlyBranch}`;
}

function uniqueRelations(relations: BaziRelation[]) {
  const map = new Map<string, BaziRelation>();
  relations.forEach((item) => map.set(`${item.type}-${item.source}-${item.target}-${item.description}`, item));
  return Array.from(map.values());
}
