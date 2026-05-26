import type { ExportJob } from "@/types/bazi";

export async function exportChartPdf(chartId: string): Promise<ExportJob> {
  return createExportJob(chartId, "pdf");
}

export async function exportChartImage(chartId: string): Promise<ExportJob> {
  return createExportJob(chartId, "image");
}

export async function getExportJob(jobId: string): Promise<ExportJob> {
  return {
    id: jobId,
    chartId: "",
    type: "pdf",
    status: "queued",
    message: "导出功能即将开放。"
  };
}

function createExportJob(chartId: string, type: ExportJob["type"]): ExportJob {
  return {
    id: `export_${Date.now()}`,
    chartId,
    type,
    status: "queued",
    message: "导出功能即将开放。"
  };
}
