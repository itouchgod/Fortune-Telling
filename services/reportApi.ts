import type { MingShuReport } from "@/types/bazi";

export async function createMingShuReport(chartId: string): Promise<MingShuReport> {
  return {
    id: `report_${Date.now()}`,
    chartId,
    status: "queued",
    title: "完整命书",
    createdAt: new Date().toISOString()
  };
}

export async function getMingShuReport(reportId: string): Promise<MingShuReport> {
  return {
    id: reportId,
    chartId: "",
    status: "queued",
    title: "完整命书",
    createdAt: new Date().toISOString()
  };
}
