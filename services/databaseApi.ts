import type { BaziChart, CloudChartRecord } from "@/types/bazi";

export async function syncChartToCloud(chart: BaziChart, ownerId: string): Promise<CloudChartRecord> {
  return {
    chart,
    ownerId,
    syncedAt: new Date().toISOString()
  };
}

export async function getCloudCharts(_ownerId: string): Promise<CloudChartRecord[]> {
  return [];
}

export async function deleteCloudChart(_chartId: string): Promise<void> {
  return Promise.resolve();
}
