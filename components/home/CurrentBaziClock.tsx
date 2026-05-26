"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTimeLocal, getCurrentPlateSnapshot } from "@/lib/bazi/currentPlate";

const pillarUnits = ["年", "月", "日", "时"] as const;

const pillarColors = [
  "text-cinnabar",
  "text-jade",
  "text-ink",
  "text-jade"
] as const;

function parseDateTimeLocal(value: string) {
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  if ([year, month, day, hour, minute].some((part) => Number.isNaN(part))) return null;

  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

export default function CurrentBaziClock() {
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai",
    []
  );
  const [mounted, setMounted] = useState(false);
  const [selectedAt, setSelectedAt] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const now = new Date();
    setSelectedAt(now);
    setInputValue(formatDateTimeLocal(now));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = window.setInterval(() => {
      setSelectedAt((current) => {
        if (!current) return current;
        const now = new Date();
        const isLive = formatDateTimeLocal(current) === formatDateTimeLocal(now);
        if (isLive) {
          setInputValue(formatDateTimeLocal(now));
          return now;
        }
        return current;
      });
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [mounted]);

  if (!mounted || !selectedAt) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
        <div className="h-12 animate-pulse rounded bg-slate-100" />
        <div className="h-10 animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  const snapshot = getCurrentPlateSnapshot(selectedAt, timezone);
  const pillars = [
    [snapshot.yearStem, snapshot.yearBranch],
    [snapshot.monthStem, snapshot.monthBranch],
    [snapshot.dayStem, snapshot.dayBranch],
    [snapshot.hourStem, snapshot.hourBranch]
  ] as const;
  const isLive = formatDateTimeLocal(selectedAt) === formatDateTimeLocal(new Date());

  return (
    <div className="space-y-4">
      <p className="text-sm text-jade">{snapshot.jieLabel}</p>

      <h2 className="flex flex-wrap items-end justify-center gap-x-3 gap-y-2 text-center text-3xl font-semibold tracking-wide md:text-4xl">
        {pillars.map(([stem, branch], index) => (
          <span key={pillarUnits[index]} className={`inline-flex items-end gap-1 ${pillarColors[index]}`}>
            <span>{stem}</span>
            <span>{branch}</span>
            <span className="pb-1 text-sm font-normal text-slate-500">{pillarUnits[index]}</span>
          </span>
        ))}
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="datetime-local"
          value={inputValue}
          onChange={(event) => {
            const nextDate = parseDateTimeLocal(event.target.value);
            if (!nextDate) return;
            setInputValue(event.target.value);
            setSelectedAt(nextDate);
          }}
          className="focus-ring min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
        />
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            setSelectedAt(now);
            setInputValue(formatDateTimeLocal(now));
          }}
          className={`focus-ring rounded-md border px-4 py-2 text-sm font-medium ${isLive ? "border-jade bg-jade text-white" : "border-line bg-white text-ink"}`}
        >
          现在
        </button>
      </div>

      <p className="text-xs text-slate-500">{snapshot.timezone}</p>
    </div>
  );
}
