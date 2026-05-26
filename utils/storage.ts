import type { BaziChart, PaipanSettings } from "@/types/bazi";

const SAVED_CHARTS_KEY = "bazi.savedCharts";
const CURRENT_CHART_KEY = "bazi.currentChart";
const CHARTS_KEY = "bazi.charts";
const SETTINGS_KEY = "bazi.settings";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readCurrentChart(): BaziChart | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(CURRENT_CHART_KEY);
  return raw ? (JSON.parse(raw) as BaziChart) : null;
}

export function writeCurrentChart(chart: BaziChart) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CURRENT_CHART_KEY, JSON.stringify(chart));
  upsertChartCache(chart);
}

export function readChartCache(): BaziChart[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(CHARTS_KEY);
  const cached = raw ? (JSON.parse(raw) as BaziChart[]) : [];
  const current = readCurrentChartWithoutCache();
  const saved = readSavedChartsWithoutCache();
  const merged = mergeCharts([...cached, ...saved, ...(current ? [current] : [])]);
  if (merged.length !== cached.length) {
    window.localStorage.setItem(CHARTS_KEY, JSON.stringify(merged));
  }
  return merged;
}

export function writeChartCache(charts: BaziChart[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CHARTS_KEY, JSON.stringify(mergeCharts(charts)));
}

export function getCachedChart(id: string): BaziChart | null {
  return readChartCache().find((chart) => chart.id === id) ?? null;
}

export function upsertChartCache(chart: BaziChart) {
  const charts = readChartCache();
  const next = [chart, ...charts.filter((item) => item.id !== chart.id)];
  writeChartCache(next);
  return next;
}

export function readSavedCharts(): BaziChart[] {
  if (!canUseStorage()) return [];
  return readSavedChartsWithoutCache();
}

export function writeSavedCharts(charts: BaziChart[]) {
  if (!canUseStorage()) return;
  const next = mergeCharts(charts);
  window.localStorage.setItem(SAVED_CHARTS_KEY, JSON.stringify(next));
  writeChartCache(next);
}

export function upsertSavedChart(chart: BaziChart) {
  const charts = readSavedCharts();
  const next = [chart, ...charts.filter((item) => item.id !== chart.id)];
  writeSavedCharts(next);
  upsertChartCache(chart);
  return next;
}

export function removeSavedChart(id: string) {
  const next = readSavedCharts().filter((item) => item.id !== id);
  writeSavedCharts(next);
  return next;
}

export function readPaipanSettings(): Partial<PaipanSettings> | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  return raw ? (JSON.parse(raw) as Partial<PaipanSettings>) : null;
}

export function writePaipanSettings(settings: PaipanSettings) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function readCurrentChartWithoutCache(): BaziChart | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(CURRENT_CHART_KEY);
  return raw ? (JSON.parse(raw) as BaziChart) : null;
}

function readSavedChartsWithoutCache(): BaziChart[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(SAVED_CHARTS_KEY);
  return raw ? (JSON.parse(raw) as BaziChart[]) : [];
}

function mergeCharts(charts: BaziChart[]) {
  const map = new Map<string, BaziChart>();
  charts.forEach((chart) => map.set(chart.id, chart));
  return Array.from(map.values()).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}
