"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Sidebar from "@/components/layout/Sidebar";
import ErrorState from "@/components/common/ErrorState";
import LoadingState from "@/components/common/LoadingState";
import DaYunTimeline from "@/components/luck/DaYunTimeline";
import LiuNianTable from "@/components/luck/LiuNianTable";
import RelationPanel from "@/components/luck/RelationPanel";
import FortuneTrend from "@/components/luck/FortuneTrend";
import { getChart } from "@/services/paipanApi";
import type { BaziChart } from "@/types/bazi";

export default function LuckPage() {
  const params = useParams<{ id: string }>();
  const chartId = params.id;
  const [chart, setChart] = useState<BaziChart | null | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const cycles = chart?.luckCycles ?? [];
  const activeCycle = cycles[activeIndex] ?? cycles[0];
  const relations = useMemo(() => {
    if (!activeCycle) return [];
    const map = new Map<string, (typeof activeCycle.relations)[number]>();
    [...activeCycle.relations, ...activeCycle.years.flatMap((year) => year.relations)].forEach((item) => {
      map.set(`${item.type}-${item.source}-${item.target}-${item.description}`, item);
    });
    return Array.from(map.values());
  }, [activeCycle]);

  useEffect(() => {
    getChart(chartId).then((nextChart) => {
      setChart(nextChart);
      const currentIndex = nextChart?.luckCycles?.findIndex((cycle) => cycle.pillar === nextChart.currentLuckCycle?.pillar) ?? -1;
      setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    });
  }, [chartId]);

  if (chart === undefined) {
    return (
      <PageContainer title="大运流年">
        <LoadingState message="正在读取大运流年..." />
      </PageContainer>
    );
  }

  if (!chart || !activeCycle) {
    return (
      <PageContainer title="大运流年">
        <ErrorState title="命盘不存在" message="没有找到对应命盘，无法展示大运流年。" />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="大运流年" description="展示起运信息、十年大运、流年干支以及与原局的基础关系。">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Sidebar chartId={chartId} />
        <div className="grid gap-6">
          <section className="panel">
            <div className="panel-header"><h2 className="font-semibold text-ink">起运信息</h2></div>
            <div className="panel-body grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
              <div>起运年龄：{chart.qiYun?.startAge ?? activeCycle.startAge} 岁</div>
              <div>起运年份：{chart.qiYun?.startYear ?? activeCycle.startYear} 年</div>
              <div>当前大运：{activeCycle.pillar}</div>
              <div className="sm:col-span-3">{chart.qiYun?.description}</div>
              <div className="sm:col-span-3">{chart.qiYun?.basis}</div>
            </div>
          </section>
          <DaYunTimeline cycles={cycles} activeIndex={activeIndex} onSelect={setActiveIndex} />
          <RelationPanel relations={relations} />
          <LiuNianTable years={activeCycle.years} />
          <FortuneTrend />
        </div>
      </div>
    </PageContainer>
  );
}
