"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { readPaipanSettings, writePaipanSettings } from "@/utils/storage";
import type { CalendarType, PaipanSettings, ZiHourRule } from "@/types/bazi";

const defaultSettings: PaipanSettings = {
  useTrueSolarTime: true,
  useEquationOfTime: true,
  ziHourRule: "lateZi",
  defaultCalendar: "solar",
  qiYunRule: "lunar-typescript-default",
  aiPreference: "balanced",
  paipanRule: "standard"
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<PaipanSettings>(defaultSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = readPaipanSettings();
    if (saved) setSettings((current) => ({ ...current, ...saved }));
  }, []);

  function patchSettings(value: Partial<PaipanSettings>) {
    setSettings((current) => ({ ...current, ...value }));
  }

  function handleSave() {
    writePaipanSettings(settings);
    setMessage("设置已保存");
  }

  return (
    <PageContainer title="设置" description="保留排盘规则和 AI 分析偏好，后续可作为 createChart 默认参数。">
      <section className="panel">
        <div className="panel-header">
          <h2 className="font-semibold text-ink">排盘规则设置</h2>
        </div>
        <div className="panel-body grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">排盘规则</span>
            <select
              value={settings.paipanRule}
              onChange={(event) => patchSettings({ paipanRule: event.target.value })}
              className="focus-ring rounded-md border border-line bg-white px-3 py-2"
            >
              <option value="standard">标准规则</option>
              <option value="wenzhen-like">问真风格</option>
              <option value="classic">传统规则</option>
            </select>
          </label>

          <label className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2">
            <span className="text-sm font-medium text-slate-700">真太阳时默认开关</span>
            <input
              type="checkbox"
              checked={settings.useTrueSolarTime}
              onChange={(event) => patchSettings({ useTrueSolarTime: event.target.checked })}
              className="h-5 w-5 accent-jade"
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-line bg-white px-3 py-2">
            <span className="text-sm font-medium text-slate-700">均时差修正</span>
            <input
              type="checkbox"
              checked={settings.useEquationOfTime}
              disabled={!settings.useTrueSolarTime}
              onChange={(event) => patchSettings({ useEquationOfTime: event.target.checked })}
              className="h-5 w-5 accent-jade disabled:opacity-40"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">子时换日设置</span>
            <select
              value={settings.ziHourRule}
              onChange={(event) => patchSettings({ ziHourRule: event.target.value as ZiHourRule })}
              className="focus-ring rounded-md border border-line bg-white px-3 py-2"
            >
              <option value="lateZi">晚子时换日</option>
              <option value="earlyZi">早子时换日</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">起运规则</span>
            <input
              value="年柱立春 / 月柱节气 / 起运按 lunar-typescript"
              readOnly
              className="rounded-md border border-line bg-slate-50 px-3 py-2 text-slate-600"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">默认历法</span>
            <select
              value={settings.defaultCalendar}
              onChange={(event) => patchSettings({ defaultCalendar: event.target.value as CalendarType })}
              className="focus-ring rounded-md border border-line bg-white px-3 py-2"
            >
              <option value="solar">公历</option>
              <option value="lunar">农历</option>
            </select>
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-700">AI 分析偏好</span>
            <select
              value={settings.aiPreference}
              onChange={(event) => patchSettings({ aiPreference: event.target.value })}
              className="focus-ring rounded-md border border-line bg-white px-3 py-2"
            >
              <option value="brief">简洁摘要</option>
              <option value="balanced">均衡分析</option>
              <option value="detailed">详细命书</option>
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <button onClick={handleSave} className="focus-ring rounded-md bg-jade px-4 py-2 text-sm font-medium text-white">保存设置</button>
            {message && <span className="text-sm text-jade">{message}</span>}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
