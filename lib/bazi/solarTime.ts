import { formatDateTime } from "@/lib/bazi/calendar";
import { getEquationOfTimeMinutes } from "@/lib/bazi/equationOfTime";

export interface TrueSolarTimeResult {
  date: Date;
  text: string;
  longitudeCorrectionMinutes: number;
  equationOfTimeCorrectionMinutes: number;
}

export function applyTrueSolarTime(
  localTime: Date,
  longitude: number,
  timezoneOffset: number,
  enabled: boolean,
  useEquationOfTime = true
): TrueSolarTimeResult {
  const equationOfTimeCorrectionMinutes = enabled && useEquationOfTime ? getEquationOfTimeMinutes(localTime) : 0;
  if (!enabled) {
    return {
      date: new Date(localTime.getTime()),
      text: "未使用",
      longitudeCorrectionMinutes: 0,
      equationOfTimeCorrectionMinutes: 0
    };
  }

  const standardMeridian = timezoneOffset * 15;
  const longitudeCorrectionMinutes = (longitude - standardMeridian) * 4;
  const totalCorrection = longitudeCorrectionMinutes + equationOfTimeCorrectionMinutes;
  const date = new Date(localTime.getTime());
  date.setMinutes(date.getMinutes() + Math.round(totalCorrection));

  return {
    date,
    text: formatDateTime(date),
    longitudeCorrectionMinutes,
    // 均时差会随日期变化。第一版保留参数入口，后续可接更精确天文公式。
    equationOfTimeCorrectionMinutes
  };
}

export function applyZiHourRule(date: Date, ziHourRule: "earlyZi" | "lateZi") {
  const next = new Date(date.getTime());
  if (ziHourRule === "earlyZi" && next.getHours() === 23) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}
