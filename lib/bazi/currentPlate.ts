import { Solar } from "lunar-typescript";
import { cities } from "@/data/cities";
import type { BirthInfo, Gender, PaipanSettings } from "@/types/bazi";

export interface CurrentPlateSnapshot {
  yearStem: string;
  yearBranch: string;
  monthStem: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourStem: string;
  hourBranch: string;
  jieLabel: string;
  timezone: string;
}

export function getCurrentPlateSnapshot(date: Date, timezone = "Asia/Shanghai"): CurrentPlateSnapshot {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  const prevJie = lunar.getPrevJie();
  const jieSolar = prevJie.getSolar();

  return {
    yearStem: eightChar.getYearGan(),
    yearBranch: eightChar.getYearZhi(),
    monthStem: eightChar.getMonthGan(),
    monthBranch: eightChar.getMonthZhi(),
    dayStem: eightChar.getDayGan(),
    dayBranch: eightChar.getDayZhi(),
    hourStem: eightChar.getTimeGan(),
    hourBranch: eightChar.getTimeZhi(),
    jieLabel: formatJieLabel(prevJie.getName(), jieSolar.getMonth(), jieSolar.getDay(), jieSolar.getHour(), jieSolar.getMinute(), eightChar.getMonthZhi()),
    timezone
  };
}

function formatJieLabel(name: string, month: number, day: number, hour: number, minute: number, monthBranch: string) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `节令 ${name} ${month}/${day} ${pad(hour)}:${pad(minute)} · ${monthBranch}月`;
}

export function formatDateTimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatBirthDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatBirthTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatChineseDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${pad(date.getHours())}时${pad(date.getMinutes())}分`;
}

function findCityByTimezone(timezone: string) {
  return (
    cities.find((city) => city.timezone === timezone && city.city === "上海") ??
    cities.find((city) => city.timezone === timezone) ??
    cities.find((city) => city.city === "上海")!
  );
}

function formatBirthPlace(city: (typeof cities)[number]) {
  return city.province === city.city ? city.city : `${city.province}${city.city}`;
}

export function buildTimelyPlateBirthInfo(
  date: Date,
  timezone: string,
  settings?: Partial<PaipanSettings> | null,
  overrides?: Partial<Pick<BirthInfo, "name" | "gender" | "useTrueSolarTime">>
): BirthInfo {
  const matchedCity = findCityByTimezone(timezone);
  const useMatchedCity = matchedCity.timezone === timezone;

  return {
    name: overrides?.name ?? "及时盘",
    gender: overrides?.gender ?? "male",
    calendarType: settings?.defaultCalendar ?? "solar",
    birthDate: formatBirthDate(date),
    birthTime: formatBirthTime(date),
    birthPlace: useMatchedCity ? formatBirthPlace(matchedCity) : timezone,
    longitude: matchedCity.longitude,
    latitude: matchedCity.latitude,
    timezone,
    timezoneOffset: matchedCity.timezoneOffset,
    useTrueSolarTime: overrides?.useTrueSolarTime ?? settings?.useTrueSolarTime ?? true,
    useEquationOfTime: settings?.useEquationOfTime ?? true,
    ziHourRule: settings?.ziHourRule ?? "lateZi",
    isLeapMonth: false
  };
}

export function buildHomePaipanBirthInfo(
  date: Date,
  timezone: string,
  options: {
    name: string;
    gender: Gender;
    useTrueSolarTime: boolean;
    settings?: Partial<PaipanSettings> | null;
  }
): BirthInfo {
  return buildTimelyPlateBirthInfo(date, timezone, options.settings, {
    name: options.name.trim() || "未命名命主",
    gender: options.gender,
    useTrueSolarTime: options.useTrueSolarTime
  });
}
