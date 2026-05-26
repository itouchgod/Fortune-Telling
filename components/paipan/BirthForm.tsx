"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CalendarTypeSwitch from "@/components/paipan/CalendarTypeSwitch";
import GenderSelect from "@/components/paipan/GenderSelect";
import BirthTimeSelect from "@/components/paipan/BirthTimeSelect";
import BirthPlaceInput from "@/components/paipan/BirthPlaceInput";
import CitySelector from "@/components/paipan/CitySelector";
import TrueSolarTimeToggle from "@/components/paipan/TrueSolarTimeToggle";
import StartPaipanButton from "@/components/paipan/StartPaipanButton";
import { createChart } from "@/services/paipanApi";
import { readPaipanSettings } from "@/utils/storage";
import type { BirthInfo, ZiHourRule } from "@/types/bazi";

const defaultBirthInfo: BirthInfo = {
  name: "",
  gender: "unknown",
  calendarType: "solar",
  birthDate: "1992-08-18",
  birthTime: "09:30",
  birthPlace: "上海市",
  longitude: 121.47,
  latitude: 31.23,
  timezone: "Asia/Shanghai",
  timezoneOffset: 8,
  useTrueSolarTime: true,
  useEquationOfTime: true,
  ziHourRule: "lateZi",
  isLeapMonth: false
};

function isValidDate(value: string | null) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function isValidTime(value: string | null) {
  return Boolean(value && /^\d{2}:\d{2}$/.test(value));
}

export default function BirthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<BirthInfo>(defaultBirthInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const settings = readPaipanSettings();
    const prefilledDate = searchParams.get("date");
    const prefilledTime = searchParams.get("time");

    setForm((current) => ({
      ...current,
      calendarType: settings?.defaultCalendar ?? current.calendarType,
      useTrueSolarTime: settings?.useTrueSolarTime ?? current.useTrueSolarTime,
      useEquationOfTime: settings?.useEquationOfTime ?? current.useEquationOfTime,
      ziHourRule: settings?.ziHourRule ?? current.ziHourRule,
      birthDate: isValidDate(prefilledDate) ? prefilledDate! : current.birthDate,
      birthTime: isValidTime(prefilledTime) ? prefilledTime! : current.birthTime
    }));
  }, [searchParams]);

  function patchForm(value: Partial<BirthInfo>) {
    setForm((current) => ({ ...current, ...value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      const chart = await createChart({ ...form, name: form.name.trim() || "未命名命主" });
      router.push(`/chart/${chart.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "排盘失败，请检查出生信息。");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">出生信息</h2>
        <p className="mt-1 text-sm text-slate-600">填写出生信息后，系统会按时区、真太阳时、子时换日和节气规则计算四柱。</p>
      </div>
      <div className="panel-body grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">姓名 / 昵称</span>
          <input
            value={form.name}
            onChange={(event) => patchForm({ name: event.target.value })}
            placeholder="请输入姓名或昵称"
            className="focus-ring rounded-md border border-line px-3 py-2"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">性别</span>
            <GenderSelect value={form.gender} onChange={(gender) => patchForm({ gender })} />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">历法</span>
            <CalendarTypeSwitch value={form.calendarType} onChange={(calendarType) => patchForm({ calendarType })} />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">出生日期</span>
            <input
              type="date"
              value={form.birthDate}
              onChange={(event) => patchForm({ birthDate: event.target.value })}
              className="focus-ring rounded-md border border-line px-3 py-2"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">出生时间</span>
            <BirthTimeSelect value={form.birthTime} onChange={(birthTime) => patchForm({ birthTime })} />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">出生地区 / 经纬度</span>
          <CitySelector
            value=""
            onSelect={(city) =>
              patchForm({
                birthPlace: city.province === city.city ? city.city : `${city.province}${city.city}`,
                longitude: city.longitude,
                latitude: city.latitude,
                timezone: city.timezone,
                timezoneOffset: city.timezoneOffset
              })
            }
          />
          <BirthPlaceInput
            place={form.birthPlace}
            longitude={form.longitude}
            latitude={form.latitude}
            onPlaceChange={(birthPlace) => patchForm({ birthPlace })}
            onLongitudeChange={(longitude) => patchForm({ longitude })}
            onLatitudeChange={(latitude) => patchForm({ latitude })}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.timezone ?? ""}
              onChange={(event) => patchForm({ timezone: event.target.value })}
              placeholder="时区，如 Asia/Shanghai"
              className="focus-ring rounded-md border border-line px-3 py-2"
            />
            <input
              type="number"
              step="0.5"
              value={form.timezoneOffset ?? 8}
              onChange={(event) => patchForm({ timezoneOffset: Number(event.target.value) })}
              placeholder="UTC 偏移，如 8"
              className="focus-ring rounded-md border border-line px-3 py-2"
            />
          </div>
        </label>

        {form.calendarType === "lunar" && (
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-line bg-white px-3 py-2">
            <span className="text-sm text-slate-700">农历闰月</span>
            <input
              type="checkbox"
              checked={Boolean(form.isLeapMonth)}
              onChange={(event) => patchForm({ isLeapMonth: event.target.checked })}
              className="h-5 w-5 accent-jade"
            />
          </label>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <TrueSolarTimeToggle checked={form.useTrueSolarTime} onChange={(useTrueSolarTime) => patchForm({ useTrueSolarTime })} />
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-line bg-white px-3 py-2">
            <span className="text-sm text-slate-700">均时差修正</span>
            <input
              type="checkbox"
              checked={Boolean(form.useEquationOfTime)}
              disabled={!form.useTrueSolarTime}
              onChange={(event) => patchForm({ useEquationOfTime: event.target.checked })}
              className="h-5 w-5 accent-jade disabled:opacity-40"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">子时换日规则</span>
            <select
              value={form.ziHourRule}
              onChange={(event) => patchForm({ ziHourRule: event.target.value as ZiHourRule })}
              className="focus-ring rounded-md border border-line bg-white px-3 py-2"
            >
              <option value="earlyZi">子初换日（23:00 后算次日）</option>
              <option value="lateZi">子正换日（00:00 后算次日）</option>
            </select>
          </label>
        </div>

        {error && <div className="rounded-md border border-cinnabar/30 bg-cinnabar/5 px-3 py-2 text-sm text-cinnabar">{error}</div>}
        <StartPaipanButton loading={loading} />
      </div>
    </form>
  );
}
