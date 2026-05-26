import type { BirthInfo } from "@/types/bazi";
import { resolveTimezoneOffset } from "@/lib/bazi/dst";

export interface TimezoneInfo {
  timezone: string;
  timezoneOffset: number;
  standardMeridian: number;
  isDst: boolean;
  offsetLabel: string;
  warning?: string;
}

export function resolveTimezone(birthInfo: BirthInfo, localDate?: Date): TimezoneInfo {
  const timezoneOffset = birthInfo.timezoneOffset;
  if (typeof timezoneOffset !== "number" || !Number.isFinite(timezoneOffset)) {
    throw new Error("请选择出生城市或填写 UTC 时区偏移。");
  }
  const timezone = birthInfo.timezone || timezoneNameFromOffset(timezoneOffset);
  const resolved = birthInfo.timezone && localDate ? resolveTimezoneOffset(timezone, localDate, timezoneOffset) : null;
  const effectiveOffset = resolved?.timezoneOffset ?? timezoneOffset;

  return {
    timezone,
    timezoneOffset: effectiveOffset,
    standardMeridian: effectiveOffset * 15,
    isDst: Boolean(resolved?.isDst),
    offsetLabel: resolved?.offsetLabel ?? timezoneNameFromOffset(timezoneOffset),
    warning: resolved?.warning
  };
}

function timezoneNameFromOffset(offset: number) {
  return `UTC${offset >= 0 ? "+" : ""}${offset}`;
}
