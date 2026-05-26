"use client";

import { useState } from "react";
import { saveChart } from "@/services/paipanApi";
import type { BaziChart } from "@/types/bazi";

export default function ChartActions({ chart }: { chart: BaziChart }) {
  const [message, setMessage] = useState("");

  async function handleSave() {
    await saveChart(chart.id);
    setMessage("已保存到我的命盘");
  }

  async function handleCopy() {
    const text = `${chart.basicInfo.name}：${chart.pillars.map((pillar) => pillar.heavenlyStem + pillar.earthlyBranch).join(" ")}`;
    await navigator.clipboard?.writeText(text);
    setMessage("命盘摘要已复制");
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">命盘操作</h2>
      </div>
      <div className="panel-body flex flex-wrap items-center gap-3">
        <button onClick={handleSave} className="focus-ring rounded-md bg-jade px-4 py-2 text-sm font-medium text-white">保存命盘</button>
        <button onClick={handleCopy} className="focus-ring rounded-md border border-line bg-white px-4 py-2 text-sm">复制命盘</button>
        <button disabled title="导出功能即将开放" className="rounded-md border border-line bg-slate-100 px-4 py-2 text-sm text-slate-400">导出图片</button>
        <button disabled title="导出功能即将开放" className="rounded-md border border-line bg-slate-100 px-4 py-2 text-sm text-slate-400">导出 PDF</button>
        {message && <span className="text-sm text-jade">{message}</span>}
      </div>
    </section>
  );
}
