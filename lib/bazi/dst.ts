import { Temporal } from "@js-temporal/polyfill";

export interface ResolvedTimezone {
  timezone: string;
  timezoneOffset: number;
  isDst: boolean;
  offsetLabel: string;
  usedFallback: boolean;
  warning?: string;
}

export function resolveTimezoneOffset(timezone: string, localDate: Date, fallbackOffset?: number): ResolvedTimezone {
  try {
    const zdt = Temporal.ZonedDateTime.from({
      year: localDate.getFullYear(),
      month: localDate.getMonth() + 1,
      day: localDate.getDate(),
      hour: localDate.getHours(),
      minute: localDate.getMinutes(),
      second: localDate.getSeconds(),
      millisecond: localDate.getMilliseconds(),
      timeZone: timezone
    });
    const timezoneOffset = offsetToHours(zdt.offset);
    const standardOffset = getStandardOffset(timezone, localDate.getFullYear(), fallbackOffset ?? timezoneOffset);

    return {
      timezone,
      timezoneOffset,
      isDst: Math.abs(timezoneOffset - standardOffset) > 0.001,
      offsetLabel: getOffsetLabel(timezone, zdt.epochMilliseconds, timezoneOffset),
      usedFallback: false
    };
  } catch {
    if (typeof fallbackOffset === "number" && Number.isFinite(fallbackOffset)) {
      return {
        timezone,
        timezoneOffset: fallbackOffset,
        isDst: false,
        offsetLabel: formatOffset(fallbackOffset),
        usedFallback: true,
        warning: `无法解析 ${timezone} 的历史时区，已回退到 ${formatOffset(fallbackOffset)}。`
      };
    }
    throw new Error(`无法解析出生时区：${timezone}`);
  }
}

function getStandardOffset(timezone: string, year: number, fallbackOffset: number) {
  try {
    const january = Temporal.ZonedDateTime.from({ year, month: 1, day: 15, hour: 12, timeZone: timezone });
    const july = Temporal.ZonedDateTime.from({ year, month: 7, day: 15, hour: 12, timeZone: timezone });
    const janOffset = offsetToHours(january.offset);
    const julOffset = offsetToHours(july.offset);
    return Math.abs(janOffset) > Math.abs(julOffset) ? janOffset : julOffset;
  } catch {
    return fallbackOffset;
  }
}

function offsetToHours(offset: string) {
  const match = offset.match(/^([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) + Number(match[3]) / 60 + Number(match[4] ?? 0) / 3600);
}

function getOffsetLabel(timezone: string, epochMilliseconds: number, offset: number) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "short" }).formatToParts(new Date(epochMilliseconds));
  const name = parts.find((part) => part.type === "timeZoneName")?.value;
  return name ? `${formatOffset(offset)} (${name})` : formatOffset(offset);
}

function formatOffset(offset: number) {
  return `UTC${offset >= 0 ? "+" : ""}${Number.isInteger(offset) ? offset : offset.toFixed(2)}`;
}
