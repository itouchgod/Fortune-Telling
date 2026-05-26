import type { BirthInfo } from "@/types/bazi";

export type BaziTestTag = "regression" | "solar-term" | "zi-hour" | "lunar" | "dst" | "true-solar" | "validation" | "meta";

export interface BaziTestCase {
  id: string;
  name: string;
  birthInfo: BirthInfo;
  expected?: { yearPillar: string; monthPillar: string; dayPillar: string; hourPillar: string };
  expectError?: boolean;
  errorIncludes?: string;
  expectMeta?: {
    timezoneOffset?: number;
    isDst?: boolean;
    warningIncludes?: string;
  };
  tags?: BaziTestTag[];
  source?: string;
}

const beijing = { birthPlace: "北京", longitude: 116.4, latitude: 39.9, timezone: "Asia/Shanghai", timezoneOffset: 8 };
const shanghai = { birthPlace: "上海", longitude: 121.47, latitude: 31.23, timezone: "Asia/Shanghai", timezoneOffset: 8 };
const hongKong = { birthPlace: "香港", longitude: 114.17, latitude: 22.32, timezone: "Asia/Hong_Kong", timezoneOffset: 8 };
const tokyo = { birthPlace: "东京", longitude: 139.69, latitude: 35.69, timezone: "Asia/Tokyo", timezoneOffset: 9 };
const la = { birthPlace: "美国洛杉矶", longitude: -118.24, latitude: 34.05, timezone: "America/Los_Angeles", timezoneOffset: -8 };
const ny = { birthPlace: "美国纽约", longitude: -74.01, latitude: 40.71, timezone: "America/New_York", timezoneOffset: -5 };
const singapore = { birthPlace: "新加坡", longitude: 103.82, latitude: 1.35, timezone: "Asia/Singapore", timezoneOffset: 8 };
const taipei = { birthPlace: "台北", longitude: 121.56, latitude: 25.04, timezone: "Asia/Taipei", timezoneOffset: 8 };
const shenzhen = { birthPlace: "深圳", longitude: 114.05, latitude: 22.55, timezone: "Asia/Shanghai", timezoneOffset: 8 };
const guangzhou = { birthPlace: "广州", longitude: 113.26, latitude: 23.13, timezone: "Asia/Shanghai", timezoneOffset: 8 };

const baseBirthInfo: Omit<BirthInfo, "birthDate" | "birthTime" | "birthPlace" | "longitude" | "latitude" | "timezone" | "timezoneOffset"> = {
  name: "校验案例",
  gender: "male",
  calendarType: "solar",
  useTrueSolarTime: false,
  useEquationOfTime: true,
  ziHourRule: "lateZi",
  isLeapMonth: false
};

function tc(
  id: string,
  name: string,
  birthDate: string,
  birthTime: string,
  expected: [string, string, string, string],
  overrides: Partial<BirthInfo> = {},
  tags: BaziTestTag[] = ["regression"]
): BaziTestCase {
  return {
    id,
    name,
    birthInfo: { ...baseBirthInfo, ...beijing, birthDate, birthTime, ...overrides },
    expected: {
      yearPillar: expected[0],
      monthPillar: expected[1],
      dayPillar: expected[2],
      hourPillar: expected[3]
    },
    tags,
    source: "回归期望四柱，需持续与权威万年历人工复核"
  };
}

export const baziTestCases: BaziTestCase[] = [
  tc("TC-LEGACY-01", "普通北京时间案例", "1992-08-18", "09:30", ["壬申", "戊申", "丙寅", "癸巳"], shanghai),
  tc("TC-LEGACY-02", "立春前年柱仍属上一年", "2024-02-04", "10:00", ["癸卯", "乙丑", "戊戌", "丁巳"], {}, ["regression", "solar-term"]),
  tc("TC-LEGACY-03", "节气后月柱切换", "2024-03-05", "12:00", ["甲辰", "丁卯", "戊辰", "戊午"], {}, ["regression", "solar-term"]),
  tc("TC-LEGACY-04", "23 点子初换日", "2024-05-10", "23:30", ["甲辰", "己巳", "乙亥", "戊子"], { ziHourRule: "earlyZi" }, ["regression", "zi-hour"]),
  tc("TC-LEGACY-05", "海外城市时区案例", "1990-01-15", "10:00", ["己巳", "丁丑", "庚辰", "辛巳"], la, ["regression", "dst"]),

  tc("TC01", "北京默认", "1990-05-20", "08:00", ["庚午", "辛巳", "乙酉", "庚辰"]),
  tc("TC02", "女性案例", "1988-12-01", "14:30", ["戊辰", "癸亥", "庚寅", "癸未"], { gender: "female" }),
  tc("TC03", "香港时区案例", "2000-06-15", "09:00", ["庚辰", "壬午", "甲辰", "己巳"], hongKong),
  tc("TC04", "东京时区案例", "1995-03-20", "07:15", ["乙亥", "己卯", "庚戌", "庚辰"], tokyo),
  tc("TC05", "立春前 1 分钟", "2024-02-04", "16:27", ["癸卯", "乙丑", "戊戌", "庚申"], {}, ["regression", "solar-term"]),
  tc("TC06", "立春后 1 分钟", "2024-02-04", "16:28", ["甲辰", "丙寅", "戊戌", "庚申"], {}, ["regression", "solar-term"]),
  tc("TC07", "惊蛰前 1 分钟", "2024-03-05", "10:22", ["甲辰", "丙寅", "戊辰", "丁巳"], {}, ["regression", "solar-term"]),
  tc("TC08", "惊蛰后 1 分钟", "2024-03-05", "10:23", ["甲辰", "丁卯", "戊辰", "丁巳"], {}, ["regression", "solar-term"]),
  tc("TC09", "子初换日 23:30", "2024-05-10", "23:30", ["甲辰", "己巳", "乙亥", "戊子"], { ziHourRule: "earlyZi" }, ["regression", "zi-hour"]),
  tc("TC10", "子初换日 23:59", "2024-05-10", "23:59", ["甲辰", "己巳", "乙亥", "戊子"], { ziHourRule: "earlyZi" }, ["regression", "zi-hour"]),
  tc("TC11", "子正换日 23:30", "2024-05-10", "23:30", ["甲辰", "己巳", "甲戌", "丙子"], { ziHourRule: "lateZi" }, ["regression", "zi-hour"]),
  tc("TC12", "子正换日 00:30", "2024-05-11", "00:30", ["甲辰", "己巳", "乙亥", "丙子"], { ziHourRule: "lateZi" }, ["regression", "zi-hour"]),
  tc("TC13", "农历非闰月", "2023-02-15", "12:00", ["癸卯", "乙卯", "癸亥", "戊午"], { calendarType: "lunar", isLeapMonth: false }, ["regression", "lunar"]),
  tc("TC14", "农历闰月", "2023-02-15", "12:00", ["癸卯", "丙辰", "癸巳", "戊午"], { calendarType: "lunar", isLeapMonth: true }, ["regression", "lunar"]),
  tc("TC15", "洛杉矶冬令时", "1990-01-15", "10:00", ["己巳", "丁丑", "庚辰", "辛巳"], la, ["regression", "dst"]),
  tc("TC16", "洛杉矶夏令时", "1990-07-15", "10:00", ["庚午", "癸未", "辛巳", "癸巳"], la, ["regression", "dst"]),
  tc("TC17", "纽约冬令时", "2024-01-15", "10:00", ["癸卯", "乙丑", "戊寅", "丁巳"], ny, ["regression", "dst"]),
  tc("TC18", "纽约夏令时", "2024-07-15", "10:00", ["甲辰", "辛未", "庚辰", "辛巳"], ny, ["regression", "dst"]),
  tc("TC19", "上海真太阳时", "1992-08-18", "09:30", ["壬申", "戊申", "丙寅", "癸巳"], { ...shanghai, useTrueSolarTime: true }, ["regression", "true-solar"]),
  tc("TC20", "北京真太阳时", "2000-06-21", "11:55", ["庚辰", "壬午", "庚戌", "壬午"], { useTrueSolarTime: true }, ["regression", "true-solar"]),
  tc("TC21", "冬至附近", "2023-12-22", "12:00", ["癸卯", "甲子", "甲寅", "庚午"]),
  tc("TC22", "夏至附近", "2024-06-21", "12:00", ["甲辰", "庚午", "丙辰", "甲午"]),
  tc("TC23", "世纪交界前夜", "1999-12-31", "23:50", ["己卯", "丙子", "丁巳", "壬子"]),
  tc("TC24", "世纪交界凌晨", "2000-01-01", "00:10", ["己卯", "丙子", "戊午", "壬子"]),
  tc("TC25", "1985 小暑边界前", "1985-07-07", "02:30", ["乙丑", "壬午", "丁未", "辛丑"]),
  tc("TC26", "1976 亥月", "1976-11-11", "12:00", ["丙辰", "己亥", "丁卯", "丙午"]),
  tc("TC27", "1993 酉月", "1993-09-09", "21:45", ["癸酉", "辛酉", "癸巳", "癸亥"]),
  tc("TC28", "新加坡案例", "1980-04-04", "06:00", ["庚申", "己卯", "丁未", "癸卯"], singapore),
  tc("TC29", "台北案例", "1978-08-08", "18:20", ["戊午", "庚申", "壬寅", "己酉"], taipei),
  tc("TC30", "深圳元旦", "2001-01-01", "00:05", ["庚辰", "戊子", "甲子", "甲子"], shenzhen),
  tc("TC31", "广州芒种", "1996-06-06", "15:15", ["丙子", "甲午", "甲戌", "壬申"], guangzhou),
  tc("TC32", "上海重复回归", "1992-08-18", "09:30", ["壬申", "戊申", "丙寅", "癸巳"], shanghai),
  tc("TC33", "立春日上午不换年", "2024-02-04", "10:00", ["癸卯", "乙丑", "戊戌", "丁巳"], {}, ["regression", "solar-term"]),
  tc("TC34", "惊蛰上午不换月", "2024-03-05", "09:00", ["甲辰", "丙寅", "戊辰", "丁巳"], {}, ["regression", "solar-term"]),

  {
    id: "ERR01",
    name: "非法农历闰月",
    birthInfo: { ...baseBirthInfo, ...beijing, calendarType: "lunar", birthDate: "2023-03-15", birthTime: "12:00", isLeapMonth: true },
    expectError: true,
    errorIncludes: "闰月",
    tags: ["validation", "lunar"]
  },
  {
    id: "ERR02",
    name: "年份过早",
    birthInfo: { ...baseBirthInfo, ...beijing, birthDate: "1899-01-01", birthTime: "12:00" },
    expectError: true,
    errorIncludes: "1900",
    tags: ["validation"]
  },
  {
    id: "ERR03",
    name: "无效公历日期",
    birthInfo: { ...baseBirthInfo, ...beijing, birthDate: "2024-02-30", birthTime: "12:00" },
    expectError: true,
    errorIncludes: "无效",
    tags: ["validation"]
  },
  {
    id: "ERR04",
    name: "缺少时区偏移",
    birthInfo: { ...baseBirthInfo, ...beijing, birthDate: "2024-02-01", birthTime: "12:00", timezoneOffset: Number.NaN },
    expectError: true,
    errorIncludes: "时区",
    tags: ["validation"]
  },
  {
    ...tc("DST01", "洛杉矶 DST 真太阳时", "1990-07-15", "11:50", ["庚午", "癸未", "辛巳", "癸巳"], { ...la, useTrueSolarTime: true }, ["dst", "true-solar"]),
    expectMeta: { timezoneOffset: -7, isDst: true }
  }
];

baziTestCases.push({
  id: "DST02",
  name: "洛杉矶固定 offset 行为提示",
  birthInfo: { ...baseBirthInfo, birthDate: "1990-07-15", birthTime: "11:50", birthPlace: "美国洛杉矶", longitude: -118.24, latitude: 34.05, timezoneOffset: -8, useTrueSolarTime: true },
  expectMeta: { timezoneOffset: -8, isDst: false, warningIncludes: "真太阳时" },
  tags: ["dst", "true-solar", "meta"],
  source: "无 IANA timezone 时使用固定 offset，结果可能与 DST 解析不同"
});

baziTestCases.push(
  {
    id: "DST-META-01",
    name: "LA 夏令时 offset",
    birthInfo: { ...baseBirthInfo, ...la, birthDate: "1990-07-15", birthTime: "10:00" },
    expected: { yearPillar: "庚午", monthPillar: "癸未", dayPillar: "辛巳", hourPillar: "癸巳" },
    expectMeta: { timezoneOffset: -7, isDst: true },
    tags: ["dst", "meta"]
  },
  {
    id: "DST-META-02",
    name: "LA 冬令时 offset",
    birthInfo: { ...baseBirthInfo, ...la, birthDate: "1990-01-15", birthTime: "10:00" },
    expected: { yearPillar: "己巳", monthPillar: "丁丑", dayPillar: "庚辰", hourPillar: "辛巳" },
    expectMeta: { timezoneOffset: -8, isDst: false },
    tags: ["dst", "meta"]
  },
  {
    id: "DST-META-03",
    name: "NY 夏令时 offset",
    birthInfo: { ...baseBirthInfo, ...ny, birthDate: "2024-07-15", birthTime: "10:00" },
    expected: { yearPillar: "甲辰", monthPillar: "辛未", dayPillar: "庚辰", hourPillar: "辛巳" },
    expectMeta: { timezoneOffset: -4, isDst: true },
    tags: ["dst", "meta"]
  },
  {
    id: "DST-META-04",
    name: "上海无夏令时",
    birthInfo: { ...baseBirthInfo, ...shanghai, birthDate: "2024-07-15", birthTime: "10:00" },
    expected: { yearPillar: "甲辰", monthPillar: "辛未", dayPillar: "庚辰", hourPillar: "辛巳" },
    expectMeta: { timezoneOffset: 8, isDst: false },
    tags: ["dst", "meta"]
  },
  tc("TS-EOT-01", "夏至真太阳时含均时差", "2024-06-21", "11:55", ["甲辰", "庚午", "丙辰", "甲午"], { useTrueSolarTime: true, useEquationOfTime: true }, ["true-solar"]),
  tc("TS-EOT-02", "冬至真太阳时含均时差", "2023-12-22", "11:55", ["癸卯", "甲子", "甲寅", "庚午"], { useTrueSolarTime: true, useEquationOfTime: true }, ["true-solar"])
);
