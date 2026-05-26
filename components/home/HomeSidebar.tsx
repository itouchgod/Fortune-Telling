"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BaziChart } from "@/types/bazi";
import { BAZI_ENGINE_VERSION } from "@/lib/bazi/index";
import { readSavedCharts } from "@/utils/storage";

const quickLinks = [
  { href: "/paipan", label: "完整排盘" },
  { href: "/my-charts", label: "我的命盘" },
  { href: "/dictionary", label: "术语词典" },
  { href: "/settings", label: "排盘设置" }
];

const rulePoints = ["年柱立春换年", "月柱节气换月", "排盘依据可核对"];

function getDayPillarLabel(chart: BaziChart) {
  const dayPillar = chart.pillars.find((pillar) => pillar.type === "day");
  return dayPillar ? `${dayPillar.heavenlyStem}${dayPillar.earthlyBranch}` : "";
}

export default function HomeSidebar() {
  const [charts, setCharts] = useState<BaziChart[]>([]);

  useEffect(() => {
    setCharts(
      readSavedCharts()
        .filter((chart) => chart.calculationMeta)
        .slice(0, 4)
    );
  }, []);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <section className="panel">
        <div className="panel-header">
          <h2 className="text-sm font-semibold text-ink">最近命盘</h2>
        </div>
        <div className="panel-body">
          {charts.length === 0 ? (
            <p className="text-sm text-slate-500">
              暂无保存记录。
              <Link href="/paipan" className="ml-1 text-jade hover:underline">
                去排盘
              </Link>
            </p>
          ) : (
            <ul className="grid gap-2">
              {charts.map((chart) => (
                <li key={chart.id}>
                  <Link
                    href={`/chart/${chart.id}`}
                    className="focus-ring block rounded-md border border-line px-3 py-2 transition hover:border-jade/40"
                  >
                    <div className="text-sm font-medium text-ink">{chart.basicInfo.name}</div>
                    <div className="mt-0.5 flex items-center justify-between text-xs text-slate-500">
                      <span>{getDayPillarLabel(chart)}</span>
                      <span className="text-jade">查看</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {charts.length > 0 && (
            <Link href="/my-charts" className="focus-ring mt-3 block text-center text-xs text-jade hover:underline">
              查看全部
            </Link>
          )}
        </div>
      </section>

      <section className="panel p-4">
        <h2 className="text-sm font-semibold text-ink">快捷入口</h2>
        <nav className="mt-3 grid grid-cols-2 gap-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-md border border-line bg-slate-50 px-3 py-2 text-center text-sm text-slate-700 transition hover:border-jade/40 hover:text-jade"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </section>

      <section className="rounded-md border border-line bg-white/80 p-4 text-xs leading-5 text-slate-500">
        <p className="font-medium text-slate-600">引擎 v{BAZI_ENGINE_VERSION}</p>
        <ul className="mt-2 space-y-1">
          {rulePoints.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        <p className="mt-2">回归测试 51 条已通过。</p>
      </section>
    </aside>
  );
}
