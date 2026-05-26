"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Sidebar from "@/components/layout/Sidebar";
import ErrorState from "@/components/common/ErrorState";
import LoadingState from "@/components/common/LoadingState";
import BasicInfoCard from "@/components/chart/BasicInfoCard";
import CalculationMetaCard from "@/components/chart/CalculationMetaCard";
import BaziPlate from "@/components/chart/BaziPlate";
import ShenShaPanel from "@/components/chart/ShenShaPanel";
import WuXingChart from "@/components/chart/WuXingChart";
import ChartActions from "@/components/chart/ChartActions";
import RelationSummary from "@/components/chart/RelationSummary";
import TermDetailModal from "@/components/dictionary/TermDetailModal";
import { getChart } from "@/services/paipanApi";
import { findTermByName } from "@/services/dictionaryApi";
import type { BaziChart, DictionaryTerm } from "@/types/bazi";

function fallbackTerm(name: string): DictionaryTerm {
  return {
    id: `fallback-${name}`,
    category: "十神",
    name,
    shortExplanation: "该术语的详细解释尚未录入。",
    fullExplanation: "基础术语库暂未收录该条目，后续会补充更完整的分类解释。",
    examples: ["从命盘中点击术语即可打开此弹窗。"]
  };
}

export default function ChartResultPage() {
  const params = useParams<{ id: string }>();
  const chartId = params.id;
  const [chart, setChart] = useState<BaziChart | null>(null);
  const [term, setTerm] = useState<DictionaryTerm | null>(null);

  useEffect(() => {
    getChart(chartId).then(setChart);
  }, [chartId]);

  function handleTermClick(name: string) {
    setTerm(findTermByName(name) ?? fallbackTerm(name));
  }

  if (!chart) {
    return (
      <PageContainer title="排盘结果">
        <LoadingOrMissing chartId={chartId} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="排盘结果" description="四柱主盘、详细信息、五行分析与命盘操作都已按后端接入形态拆分。">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Sidebar chartId={chart.id} />
        <div className="grid gap-6">
          <BasicInfoCard chart={chart} />
          <CalculationMetaCard chart={chart} />
          <BaziPlate chart={chart} onTermClick={handleTermClick} />
          <RelationSummary relations={chart.relations} />
          <ShenShaPanel pillars={chart.pillars} onTermClick={handleTermClick} />
          <WuXingChart chart={chart} />
          <ChartActions chart={chart} />
        </div>
      </div>
      <TermDetailModal term={term} onClose={() => setTerm(null)} />
    </PageContainer>
  );
}

function LoadingOrMissing({ chartId }: { chartId: string }) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 300);
    return () => window.clearTimeout(timer);
  }, [chartId]);

  if (!timedOut) return <LoadingState message="正在读取命盘..." />;

  return <ErrorState title="命盘不存在" message="没有找到对应的命盘缓存。请返回排盘页重新生成，或在我的命盘中打开已保存命盘。" />;
}
