import type { AiChatMessage, AiProviderConfig } from "@/types/bazi";

export async function getAiProviderConfig(): Promise<AiProviderConfig> {
  return {
    provider: "disabled",
    model: "not-configured"
  };
}

export async function generateReport(chartId: string): Promise<{ chartId: string; status: "disabled"; message: string }> {
  return {
    chartId,
    status: "disabled",
    message: "命书生成功能暂未开放。"
  };
}

export async function askAiQuestion(chartId: string, _messages: AiChatMessage[]): Promise<AiChatMessage> {
  return {
    id: `msg_${Date.now()}`,
    role: "assistant",
    content: `AI 分析功能正在接入中。当前可先查看命盘、大运流年和术语解释。命盘 ID：${chartId}`,
    createdAt: new Date().toISOString()
  };
}
