import type { BaziChart, BirthInfo } from "@/types/bazi";
import { buildLuckCycles } from "@/lib/bazi/dayun";
import { buildPillars } from "@/lib/bazi/pillars";
import { solarToLunar } from "@/lib/bazi/solarToLunar";
import { buildShenSha } from "@/lib/bazi/shensha";
import { describeDayMaster, buildWuXing, inferUsefulGods } from "@/lib/bazi/wuxing";
import { buildNatalRelations } from "@/lib/bazi/relations";
import { normalizeBirthInfo } from "@/lib/bazi/validators";

export const BAZI_ENGINE_VERSION = "0.3.0";

export function buildBaziChart(birthInfo: BirthInfo, id: string): BaziChart {
  const safeBirthInfo = normalizeBirthInfo(birthInfo);
  const normalized = solarToLunar(safeBirthInfo);
  const eightChar = normalized.lunar.getEightChar();
  const pillars = buildShenSha(buildPillars(eightChar), eightChar.getDayGan());
  const wuXing = buildWuXing(pillars);
  const dayMaster = `${eightChar.getDayGan()}${elementName(eightChar.getDayWuXing())}`;
  const relations = buildNatalRelations(pillars);
  const luck = buildLuckCycles(eightChar, safeBirthInfo.gender, pillars);

  return {
    id,
    basicInfo: {
      ...safeBirthInfo,
      solarBirthday: normalized.solar.toYmdHms(),
      lunarBirthday: normalized.lunar.toString(),
      trueSolarTime: normalized.trueSolarTimeText
    },
    pillars,
    tenGods: pillars.map((pillar) => pillar.tenGod),
    hiddenStems: pillars.map((pillar) => pillar.hiddenStems),
    nayin: pillars.map((pillar) => pillar.nayin),
    kongWang: pillars.map((pillar) => pillar.kongWang),
    changSheng: pillars.map((pillar) => pillar.changSheng),
    shenSha: {
      year: pillars[0].shenSha,
      month: pillars[1].shenSha,
      day: pillars[2].shenSha,
      hour: pillars[3].shenSha
    },
    wuXing,
    dayMaster,
    strength: describeDayMaster(dayMaster, wuXing),
    usefulGods: inferUsefulGods(dayMaster, wuXing),
    relations,
    calculationMeta: {
      calendarUsed: safeBirthInfo.calendarType,
      timezone: normalized.timezoneInfo.timezone,
      timezoneOffset: normalized.timezoneInfo.timezoneOffset,
      timezoneOffsetLabel: normalized.timezoneInfo.offsetLabel,
      isDst: normalized.timezoneInfo.isDst,
      trueSolarTimeUsed: safeBirthInfo.useTrueSolarTime,
      trueSolarTime: normalized.trueSolarTimeText,
      equationOfTimeMinutes: normalized.equationOfTimeMinutes,
      ziHourRule: safeBirthInfo.ziHourRule,
      solarTermUsed: true,
      yearPillarRule: "年柱按立春换年",
      monthPillarRule: "月柱按节气换月",
      engineVersion: BAZI_ENGINE_VERSION,
      warnings: normalized.warnings
    },
    qiYun: luck.qiYun,
    luckCycles: luck.luckCycles,
    currentLuckCycle: luck.currentLuckCycle,
    createdAt: new Date().toISOString(),
    note: "由排盘引擎生成。",
    category: "排盘"
  };
}

function elementName(value: string) {
  return value.slice(0, 1) || "日主";
}
