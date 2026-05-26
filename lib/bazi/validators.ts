import { Lunar, LunarYear } from "lunar-typescript";
import type { BirthInfo } from "@/types/bazi";
import { isValidSolarDate, parseDate, parseTime } from "@/lib/bazi/calendar";

export function normalizeBirthInfo(input: BirthInfo): BirthInfo {
  const birthInfo = {
    ...input,
    name: input.name.trim() || "未命名命盘"
  };
  validateBirthInfo(birthInfo);
  return birthInfo;
}

export function validateBirthInfo(birthInfo: BirthInfo) {
  if (birthInfo.gender === "unknown") throw new Error("请选择性别。");
  if (!birthInfo.birthDate) throw new Error("请选择出生日期。");
  if (!birthInfo.birthTime) throw new Error("请选择出生时间。");
  if (!birthInfo.birthPlace.trim()) throw new Error("请选择出生城市或填写经纬度。");
  if (!Number.isFinite(birthInfo.longitude) || !Number.isFinite(birthInfo.latitude)) throw new Error("请选择出生城市或填写经纬度。");
  if (!Number.isFinite(birthInfo.timezoneOffset)) throw new Error("请选择出生城市或填写 UTC 时区偏移。");

  const date = parseDate(birthInfo.birthDate);
  const time = parseTime(birthInfo.birthTime);
  if (!Number.isInteger(date.year) || date.year < 1900 || date.year > 2100) throw new Error("出生年份需在 1900-2100 之间。");
  if (!Number.isInteger(time.hour) || !Number.isInteger(time.minute) || time.hour < 0 || time.hour > 23 || time.minute < 0 || time.minute > 59) {
    throw new Error("出生时间格式不正确。");
  }

  if (birthInfo.calendarType === "solar") {
    if (!isValidSolarDate(date)) throw new Error("公历日期无效，请检查出生日期。");
    return;
  }

  validateLunarDate(date.year, date.month, date.day, Boolean(birthInfo.isLeapMonth));
}

function validateLunarDate(year: number, month: number, day: number, isLeapMonth: boolean) {
  try {
    const lunarYear = LunarYear.fromYear(year);
    const leapMonth = lunarYear.getLeapMonth();
    const lunarMonth = isLeapMonth ? -month : month;
    if (isLeapMonth && leapMonth !== month) throw new Error("当前农历月份不是闰月，请检查日期。");
    Lunar.fromYmdHms(year, lunarMonth, day, 0, 0, 0);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("闰月")) throw error;
    throw new Error("当前农历日期无法换算，请检查日期。");
  }
}
