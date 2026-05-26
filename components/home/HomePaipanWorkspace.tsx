"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SegmentControl from "@/components/common/SegmentControl";
import PillarPreview from "@/components/home/PillarPreview";
import { WUXING_COLOR_HEX } from "@/lib/bazi/wuxingColors";
import type { WuXingItem } from "@/types/bazi";
import {
  buildHomePaipanBirthInfo,
  formatChineseDateTime,
  formatDateTimeLocal,
  getCurrentPlateSnapshot
} from "@/lib/bazi/currentPlate";
import { createChart } from "@/services/paipanApi";
import type { Gender, PillarLayout, PlateDisplayMode } from "@/types/bazi";
import { readPaipanSettings, writePaipanSettings } from "@/utils/storage";

function parseDateTimeLocal(value: string) {
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  if ([year, month, day, hour, minute].some((part) => Number.isNaN(part))) return null;

  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function persistDisplayPrefs(pillarLayout: PillarLayout, plateDisplayMode: PlateDisplayMode) {
  const saved = readPaipanSettings();
  writePaipanSettings({
    useTrueSolarTime: saved?.useTrueSolarTime ?? true,
    useEquationOfTime: saved?.useEquationOfTime ?? true,
    ziHourRule: saved?.ziHourRule ?? "lateZi",
    defaultCalendar: saved?.defaultCalendar ?? "solar",
    qiYunRule: saved?.qiYunRule ?? "lunar-typescript-default",
    aiPreference: saved?.aiPreference ?? "balanced",
    paipanRule: saved?.paipanRule ?? "standard",
    pillarLayout,
    plateDisplayMode
  });
}

export default function HomePaipanWorkspace() {
  const router = useRouter();
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Shanghai",
    []
  );

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [selectedAt, setSelectedAt] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [useTrueSolarTime, setUseTrueSolarTime] = useState(true);
  const [pillarLayout, setPillarLayout] = useState<PillarLayout>("vertical");
  const [displayMode, setDisplayMode] = useState<PlateDisplayMode>("standard");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const now = new Date();
    const saved = readPaipanSettings();
    setSelectedAt(now);
    setInputValue(formatDateTimeLocal(now));
    setUseTrueSolarTime(saved?.useTrueSolarTime ?? true);
    setPillarLayout(saved?.pillarLayout ?? "vertical");
    setDisplayMode(saved?.plateDisplayMode ?? "standard");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = window.setInterval(() => {
      setSelectedAt((current) => {
        if (!current) return current;
        const now = new Date();
        if (formatDateTimeLocal(current) === formatDateTimeLocal(now)) {
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
        <div className="home-paipan-preview animate-pulse p-6">
          <div className="mx-auto h-28 max-w-md rounded bg-white/60" />
        </div>
        <div className="panel animate-pulse p-6">
          <div className="h-40 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  const snapshot = getCurrentPlateSnapshot(selectedAt, timezone);
  const isLive = formatDateTimeLocal(selectedAt) === formatDateTimeLocal(new Date());

  function syncNow() {
    const now = new Date();
    setSelectedAt(now);
    setInputValue(formatDateTimeLocal(now));
  }

  function handleLayoutChange(layout: PillarLayout) {
    setPillarLayout(layout);
    persistDisplayPrefs(layout, displayMode);
  }

  function handleDisplayModeChange(mode: PlateDisplayMode) {
    setDisplayMode(mode);
    persistDisplayPrefs(pillarLayout, mode);
  }

  async function handleSubmit() {
    if (!selectedAt) return;
    setCreateError("");
    setCreating(true);
    try {
      const settings = readPaipanSettings();
      const birthInfo = buildHomePaipanBirthInfo(selectedAt, timezone, {
        name,
        gender,
        useTrueSolarTime,
        settings
      });
      const chart = await createChart(birthInfo);
      router.push(`/chart/${chart.id}`);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "排盘失败，请稍后重试。");
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="home-paipan-preview" aria-label="四柱预览">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">四柱预览</h2>
            <p className="mt-0.5 text-xs text-slate-500">{snapshot.timezone}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SegmentControl
              ariaLabel="四柱布局"
              value={pillarLayout}
              options={[
                { value: "vertical", label: "竖排" },
                { value: "horizontal", label: "横排" }
              ]}
              onChange={handleLayoutChange}
            />
            <SegmentControl
              ariaLabel="预览模式"
              value={displayMode}
              options={[
                { value: "simple", label: "简洁" },
                { value: "standard", label: "标准" }
              ]}
              onChange={handleDisplayModeChange}
            />
            <button
              type="button"
              onClick={syncNow}
              className={`focus-ring rounded-md border px-3 py-1 text-xs font-medium ${
                isLive ? "border-jade bg-jade text-white" : "border-amber-200 bg-white text-ink"
              }`}
            >
              现在
            </button>
          </div>
        </div>
        <div className="px-4 py-5 md:px-6 md:py-6">
          <PillarPreview snapshot={snapshot} layout={pillarLayout} displayMode={displayMode} />
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-slate-500">
            {(["金", "木", "水", "火", "土"] as WuXingItem["name"][]).map((element) => (
              <span key={element} style={{ color: WUXING_COLOR_HEX[element] }}>
                {element}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="panel" aria-label="排盘表单">
        <div className="panel-header">
          <h2 className="font-semibold text-ink">出生信息</h2>
          <p className="mt-1 text-xs text-slate-500">填写后提交；默认按浏览器时区推算经纬度。</p>
        </div>
        <div className="panel-body space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-700">姓名</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="选填"
                className="focus-ring rounded-md border border-line px-3 py-2 text-sm"
              />
            </label>
            <fieldset className="grid gap-1.5">
              <legend className="text-sm font-medium text-slate-700">性别</legend>
              <div className="flex gap-2">
                {(["male", "female"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setGender(value)}
                    className={`focus-ring flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
                      gender === value ? "border-jade bg-jade/5 text-jade" : "border-line text-slate-600"
                    }`}
                  >
                    {value === "male" ? "男" : "女"}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">出生时间</span>
            <p className="text-sm text-jade">{formatChineseDateTime(selectedAt)}</p>
            <input
              type="datetime-local"
              value={inputValue}
              onChange={(event) => {
                const nextDate = parseDateTimeLocal(event.target.value);
                if (!nextDate) return;
                setInputValue(event.target.value);
                setSelectedAt(nextDate);
              }}
              className="focus-ring rounded-md border border-line px-3 py-2 text-sm"
            />
          </label>

          <div className="flex items-center justify-between rounded-md border border-line bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-700">真太阳时校对</span>
            <button
              type="button"
              role="switch"
              aria-checked={useTrueSolarTime}
              onClick={() => setUseTrueSolarTime((current) => !current)}
              className={`focus-ring relative h-6 w-11 rounded-full transition ${
                useTrueSolarTime ? "bg-jade" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  useTrueSolarTime ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((current) => !current)}
            className="text-xs text-slate-500 hover:text-jade"
          >
            {showAdvanced ? "收起" : "展开"}高级说明
          </button>
          {showAdvanced && (
            <p className="rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
              需指定出生地、农历或闰月时，请使用
              <Link href="/paipan" className="mx-1 text-jade underline-offset-2 hover:underline">
                完整排盘
              </Link>
              。子时换日、均时差等规则在设置页统一配置。
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={creating}
            className="focus-ring w-full rounded-md bg-jade px-4 py-3 text-base font-semibold text-white transition hover:bg-jade/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "排盘中..." : "开始排盘"}
          </button>

          {createError && <p className="text-center text-sm text-cinnabar">{createError}</p>}
        </div>
      </section>
    </div>
  );
}
