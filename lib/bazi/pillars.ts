import type { HiddenStem, Pillar, PillarType } from "@/types/bazi";
import { HIDDEN_STEMS } from "@/lib/bazi/ganzhi";
import { getTenGod } from "@/lib/bazi/tenGod";

const WEIGHTS = ["主气", "中气", "余气"];

export function buildPillars(eightChar: import("lunar-typescript").EightChar): Pillar[] {
  const dayStem = eightChar.getDayGan();
  return [
    getYearPillarBySolarTerm(eightChar, dayStem),
    getMonthPillarBySolarTerm(eightChar, dayStem),
    getDayPillar(eightChar, dayStem),
    getHourPillar(eightChar, dayStem)
  ];
}

export function getYearPillarBySolarTerm(eightChar: import("lunar-typescript").EightChar, dayStem = eightChar.getDayGan()): Pillar {
  return buildPillar("year", eightChar.getYearGan(), eightChar.getYearZhi(), eightChar.getYearNaYin(), eightChar.getYearXunKong(), eightChar.getYearDiShi(), dayStem);
}

export function getMonthPillarBySolarTerm(eightChar: import("lunar-typescript").EightChar, dayStem = eightChar.getDayGan()): Pillar {
  return buildPillar("month", eightChar.getMonthGan(), eightChar.getMonthZhi(), eightChar.getMonthNaYin(), eightChar.getMonthXunKong(), eightChar.getMonthDiShi(), dayStem);
}

export function getDayPillar(eightChar: import("lunar-typescript").EightChar, dayStem = eightChar.getDayGan()): Pillar {
  return buildPillar("day", eightChar.getDayGan(), eightChar.getDayZhi(), eightChar.getDayNaYin(), eightChar.getDayXunKong(), eightChar.getDayDiShi(), dayStem);
}

export function getHourPillar(eightChar: import("lunar-typescript").EightChar, dayStem = eightChar.getDayGan()): Pillar {
  return buildPillar("hour", eightChar.getTimeGan(), eightChar.getTimeZhi(), eightChar.getTimeNaYin(), eightChar.getTimeXunKong(), eightChar.getTimeDiShi(), dayStem);
}

function buildPillar(
  type: PillarType,
  heavenlyStem: string,
  earthlyBranch: string,
  nayin: string,
  kongWang: string,
  changSheng: string,
  dayStem: string
): Pillar {
  return {
    type,
    heavenlyStem,
    earthlyBranch,
    tenGod: type === "day" ? "日主" : getTenGod(dayStem, heavenlyStem),
    hiddenStems: buildHiddenStems(dayStem, earthlyBranch),
    nayin,
    kongWang,
    changSheng,
    shenSha: []
  };
}

function buildHiddenStems(dayStem: string, earthlyBranch: string): HiddenStem[] {
  return (HIDDEN_STEMS[earthlyBranch] ?? []).map((stem, index) => ({
    stem,
    tenGod: getTenGod(dayStem, stem),
    weight: WEIGHTS[index] ?? "余气"
  }));
}
