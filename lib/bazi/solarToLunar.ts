import { Lunar, Solar } from "lunar-typescript";
import type { BirthInfo } from "@/types/bazi";
import { createLocalDate, parseDate, parseTime, toSolarArgs } from "@/lib/bazi/calendar";
import { applyTrueSolarTime, applyZiHourRule } from "@/lib/bazi/solarTime";
import { resolveTimezone, type TimezoneInfo } from "@/lib/bazi/timezone";

export interface NormalizedBirthTime {
  solar: Solar;
  lunar: Lunar;
  localDate: Date;
  calculationDate: Date;
  trueSolarTimeText: string;
  equationOfTimeMinutes: number;
  timezoneInfo: TimezoneInfo;
  warnings: string[];
}

export function solarToLunar(birthInfo: BirthInfo): NormalizedBirthTime {
  const date = parseDate(birthInfo.birthDate);
  const time = parseTime(birthInfo.birthTime);
  const localDate = createLocalDate(date, time);
  const timezoneInfo = resolveTimezone(birthInfo, localDate);
  const trueSolar = applyTrueSolarTime(localDate, birthInfo.longitude, timezoneInfo.timezoneOffset, birthInfo.useTrueSolarTime, birthInfo.useEquationOfTime ?? true);
  const calculationDate = applyZiHourRule(trueSolar.date, birthInfo.ziHourRule);
  const solar = birthInfo.calendarType === "lunar" ? lunarInputToSolar(calculationDate, Boolean(birthInfo.isLeapMonth)) : dateToSolar(calculationDate);

  return {
    solar,
    lunar: solar.getLunar(),
    localDate,
    calculationDate,
    trueSolarTimeText: birthInfo.useTrueSolarTime ? trueSolar.text : "未使用",
    equationOfTimeMinutes: trueSolar.equationOfTimeCorrectionMinutes,
    timezoneInfo,
    warnings: buildWarnings(birthInfo, timezoneInfo, trueSolar.longitudeCorrectionMinutes, trueSolar.equationOfTimeCorrectionMinutes)
  };
}

function dateToSolar(date: Date) {
  const args = toSolarArgs(date);
  return Solar.fromYmdHms(args.year, args.month, args.day, args.hour, args.minute, 0);
}

function lunarInputToSolar(date: Date, isLeapMonth: boolean) {
  const args = toSolarArgs(date);
  const lunarMonth = isLeapMonth ? -args.month : args.month;
  try {
    return Lunar.fromYmdHms(args.year, lunarMonth, args.day, args.hour, args.minute, 0).getSolar();
  } catch {
    throw new Error("当前农历日期无法换算，请检查日期。");
  }
}

function buildWarnings(birthInfo: BirthInfo, timezoneInfo: TimezoneInfo, longitudeCorrectionMinutes: number, equationOfTimeMinutes: number) {
  const warnings: string[] = [];
  if (timezoneInfo.warning) warnings.push(timezoneInfo.warning);
  if (birthInfo.timezone) warnings.push(`时区按 ${timezoneInfo.timezone} ${timezoneInfo.offsetLabel} 计算${timezoneInfo.isDst ? "，该日期处于夏令时。" : "。"}。`);
  if (birthInfo.useTrueSolarTime) {
    warnings.push(`真太阳时已按经度修正 ${Math.round(longitudeCorrectionMinutes)} 分钟，均时差修正 ${Number(equationOfTimeMinutes.toFixed(2))} 分钟。`);
  }
  if (birthInfo.ziHourRule === "earlyZi") {
    warnings.push("子初换日规则开启：23:00-23:59 按次日计算日柱。");
  }
  return warnings;
}
