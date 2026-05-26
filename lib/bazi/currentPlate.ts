import { Solar } from "lunar-typescript";

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
