import type { BaziChart, BirthInfo } from "@/types/bazi";
import { buildBaziChart } from "@/lib/bazi";
import { normalizeBirthInfo } from "@/lib/bazi/validators";
import { getCachedChart, removeSavedChart, upsertChartCache, upsertSavedChart, writeCurrentChart } from "@/utils/storage";

export class PaipanApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaipanApiError";
  }
}

// 当前在前端本地调用基础排盘引擎；后续接服务端时保持此服务层作为适配边界。
export async function createChart(birthInfo: BirthInfo): Promise<BaziChart> {
  const normalizedBirthInfo = normalizeBirthInfo(birthInfo);
  const chart = buildBaziChart(normalizedBirthInfo, createChartId());
  writeCurrentChart(chart);
  upsertChartCache(chart);
  return chart;
}

export async function getChart(id: string): Promise<BaziChart | null> {
  const chart = getCachedChart(id);
  if (!chart) return null;
  if (chart.calculationMeta && Array.isArray(chart.relations)) return chart;
  const migrated = migrateLegacyChart(chart);
  if (!migrated) return null;
  upsertChartCache(migrated);
  return migrated;
}

function migrateLegacyChart(chart: BaziChart): BaziChart | null {
  if (!hasCompleteBirthInfo(chart.basicInfo)) return null;
  try {
    const migrated = buildBaziChart(chart.basicInfo, chart.id);
    return {
      ...migrated,
      createdAt: chart.createdAt || migrated.createdAt,
      note: `${chart.note ? `${chart.note} ` : ""}[已自动迁移至引擎 v0.3.0]`,
      category: chart.category || migrated.category
    };
  } catch {
    return null;
  }
}

function hasCompleteBirthInfo(value: Partial<BirthInfo> | undefined): value is BirthInfo {
  return Boolean(
    value &&
      value.gender &&
      value.calendarType &&
      value.birthDate &&
      value.birthTime &&
      value.birthPlace &&
      Number.isFinite(value.longitude) &&
      Number.isFinite(value.latitude) &&
      Number.isFinite(value.timezoneOffset) &&
      typeof value.useTrueSolarTime === "boolean" &&
      value.ziHourRule
  );
}

export async function saveChart(id: string): Promise<BaziChart[]> {
  const chart = await getChart(id);
  if (!chart) throw new PaipanApiError("命盘不存在，无法保存。");
  return upsertSavedChart(chart);
}

export async function deleteChart(id: string): Promise<BaziChart[]> {
  return removeSavedChart(id);
}

export async function updateSavedChart(chart: BaziChart): Promise<BaziChart[]> {
  upsertChartCache(chart);
  return upsertSavedChart(chart);
}

function createChartId() {
  const raw = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `chart_${raw.replace(/-/g, "").slice(0, 12)}`;
}
