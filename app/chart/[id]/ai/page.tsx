"use client";

import { useParams } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Sidebar from "@/components/layout/Sidebar";
import EmptyState from "@/components/common/EmptyState";

export default function AiPage() {
  const params = useParams<{ id: string }>();
  const chartId = params.id;

  return (
    <PageContainer
      title="AI 分析"
      description="AI 分析功能正在接入中。当前可先查看命盘、大运流年和术语解释。"
    >
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Sidebar chartId={chartId} />
        <EmptyState
          title="AI 分析功能正在接入中"
          message="当前版本不展示自动生成的分析内容，避免用户误以为尚未校验的解读已经可用。请先查看命盘、大运流年和术语解释。"
        />
      </div>
    </PageContainer>
  );
}
