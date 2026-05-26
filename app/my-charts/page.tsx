"use client";

import { useEffect, useMemo, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import SavedChartList from "@/components/user/SavedChartList";
import ChartCategoryFilter from "@/components/user/ChartCategoryFilter";
import ChartNoteEditor from "@/components/user/ChartNoteEditor";
import { deleteChart, updateSavedChart } from "@/services/paipanApi";
import type { BaziChart } from "@/types/bazi";
import { readSavedCharts } from "@/utils/storage";

export default function MyChartsPage() {
  const [charts, setCharts] = useState<BaziChart[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [editingChart, setEditingChart] = useState<BaziChart | null>(null);

  useEffect(() => {
    setCharts(readSavedCharts().filter((chart) => chart.calculationMeta));
  }, []);

  const categories = useMemo(() => Array.from(new Set(charts.map((chart) => chart.category || "未分类"))), [charts]);

  const filteredCharts = useMemo(() => {
    return charts.filter((chart) => {
      const text = `${chart.basicInfo.name}${chart.note}${chart.category}${chart.pillars.map((pillar) => pillar.heavenlyStem + pillar.earthlyBranch).join("")}`;
      const matchQuery = !query.trim() || text.includes(query.trim());
      const matchCategory = category === "全部" || (chart.category || "未分类") === category;
      return matchQuery && matchCategory;
    });
  }, [charts, category, query]);

  async function handleDelete(id: string) {
    const next = await deleteChart(id);
    setCharts(next);
  }

  async function handleSaveNote(note: string) {
    if (!editingChart) return;
    const updated = { ...editingChart, note };
    const next = await updateSavedChart(updated);
    setCharts(next);
    setEditingChart(null);
  }

  return (
    <PageContainer title="我的命盘" description="保存命盘先使用 localStorage，支持搜索、分类筛选、备注编辑和删除。">
      <div className="grid gap-4">
        <div className="panel p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索姓名、备注、四柱"
              className="focus-ring rounded-md border border-line px-3 py-2"
            />
            <ChartCategoryFilter value={category} categories={categories} onChange={setCategory} />
          </div>
        </div>
        <SavedChartList charts={filteredCharts} onEditNote={setEditingChart} onDelete={handleDelete} />
      </div>
      {editingChart && (
        <ChartNoteEditor
          initialNote={editingChart.note || ""}
          onSave={handleSaveNote}
          onClose={() => setEditingChart(null)}
        />
      )}
    </PageContainer>
  );
}
