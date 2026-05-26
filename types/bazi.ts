export type Gender = "male" | "female" | "unknown";
export type CalendarType = "solar" | "lunar";
export type ZiHourRule = "earlyZi" | "lateZi";
export type PillarType = "year" | "month" | "day" | "hour";

export interface BirthInfo {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  longitude: number;
  latitude: number;
  timezone?: string;
  timezoneOffset?: number;
  useTrueSolarTime: boolean;
  useEquationOfTime?: boolean;
  ziHourRule: ZiHourRule;
  isLeapMonth?: boolean;
}

export interface BasicInfo extends BirthInfo {
  solarBirthday: string;
  lunarBirthday: string;
  trueSolarTime: string;
}

export interface HiddenStem {
  stem: string;
  tenGod: string;
  weight: string;
}

export interface Pillar {
  type: PillarType;
  heavenlyStem: string;
  earthlyBranch: string;
  tenGod: string;
  hiddenStems: HiddenStem[];
  nayin: string;
  kongWang: string;
  changSheng: string;
  shenSha: string[];
}

export interface WuXingItem {
  name: "金" | "木" | "水" | "火" | "土";
  count: number;
  strength: "偏弱" | "平衡" | "偏旺";
}

export interface BaziChart {
  id: string;
  basicInfo: BasicInfo;
  pillars: Pillar[];
  tenGods: string[];
  hiddenStems: HiddenStem[][];
  nayin: string[];
  kongWang: string[];
  changSheng: string[];
  shenSha: Record<PillarType, string[]>;
  wuXing: WuXingItem[];
  dayMaster: string;
  strength: string;
  usefulGods: string[];
  relations: BaziRelation[];
  calculationMeta: CalculationMeta;
  qiYun?: QiYunInfo;
  luckCycles?: LuckCycle[];
  currentLuckCycle?: LuckCycle;
  createdAt: string;
  note?: string;
  category?: string;
}

export interface LiuNian {
  year: number;
  age: number;
  ganZhi: string;
  tenGod: string;
  relations: BaziRelation[];
  note: string;
}

export interface QiYunInfo {
  startAge: number;
  startYear: number;
  startMonth: number;
  startDay: number;
  startHour: number;
  direction: "forward" | "backward";
  description: string;
  basis: string;
}

export interface LuckCycle {
  startAge: number;
  startYear: number;
  pillar: string;
  tenGod: string;
  relations: BaziRelation[];
  years: LiuNian[];
}

export interface LiuYue {
  month: number;
  ganZhi: string;
  tenGod: string;
  note: string;
}

export interface DictionaryTerm {
  id: string;
  category: "十神" | "五行" | "神煞" | "合冲刑害" | "十二长生" | "纳音";
  name: string;
  shortExplanation: string;
  fullExplanation: string;
  examples: string[];
}

export interface AiAnalysis {
  title: string;
  summary: string;
  sections: Array<{
    key: string;
    title: string;
    content: string;
  }>;
}

export type AiProvider = "openai" | "deepseek" | "disabled";

export interface AiChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface AiProviderConfig {
  provider: AiProvider;
  model: string;
  baseUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface CloudChartRecord {
  chart: BaziChart;
  ownerId: string;
  syncedAt: string;
}

export interface ExportJob {
  id: string;
  chartId: string;
  type: "pdf" | "image";
  status: "queued" | "processing" | "done" | "failed";
  url?: string;
  message?: string;
}

export interface MingShuReport {
  id: string;
  chartId: string;
  status: "queued" | "processing" | "done" | "failed";
  title: string;
  content?: string;
  createdAt: string;
}

export type PillarLayout = "vertical" | "horizontal";
export type PlateDisplayMode = "simple" | "standard";

export interface PaipanSettings {
  useTrueSolarTime: boolean;
  useEquationOfTime: boolean;
  ziHourRule: ZiHourRule;
  defaultCalendar: CalendarType;
  qiYunRule: "lunar-typescript-default";
  aiPreference: string;
  paipanRule: string;
  pillarLayout?: PillarLayout;
  plateDisplayMode?: PlateDisplayMode;
}

export interface BaziBuildResult {
  chart: BaziChart;
  luckCycles: LuckCycle[];
}

export interface CalculationMeta {
  calendarUsed: CalendarType;
  timezone: string;
  timezoneOffset: number;
  timezoneOffsetLabel?: string;
  isDst?: boolean;
  trueSolarTimeUsed: boolean;
  trueSolarTime: string;
  equationOfTimeMinutes?: number;
  ziHourRule: ZiHourRule;
  solarTermUsed: boolean;
  yearPillarRule: string;
  monthPillarRule: string;
  engineVersion: string;
  warnings: string[];
}

export interface BaziRelation {
  type: "天干五合" | "地支六合" | "地支六冲" | "地支六害" | "地支相刑" | "地支相破";
  source: string;
  target: string;
  description: string;
}
