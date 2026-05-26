import { getChart } from "../services/paipanApi.ts";

const store = new Map<string, string>();

globalThis.window = {
  localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key)
  }
} as unknown as Window & typeof globalThis;

const legacyChart = {
  id: "chart_legacy001",
  basicInfo: {
    name: "旧命盘",
    gender: "male",
    calendarType: "solar",
    birthDate: "1992-08-18",
    birthTime: "09:30",
    birthPlace: "上海",
    longitude: 121.47,
    latitude: 31.23,
    timezone: "Asia/Shanghai",
    timezoneOffset: 8,
    useTrueSolarTime: false,
    ziHourRule: "lateZi",
    solarBirthday: "1992-08-18 09:30:00",
    lunarBirthday: "",
    trueSolarTime: "未使用"
  },
  pillars: [],
  tenGods: [],
  hiddenStems: [],
  nayin: [],
  kongWang: [],
  changSheng: [],
  shenSha: { year: [], month: [], day: [], hour: [] },
  wuXing: [],
  dayMaster: "",
  strength: "",
  usefulGods: [],
  createdAt: "2026-05-26T00:00:00.000Z",
  note: "旧结构"
};

store.set("bazi.charts", JSON.stringify([legacyChart]));

const migrated = await getChart("chart_legacy001");

if (!migrated) {
  console.error("迁移失败：getChart 返回 null");
  process.exit(1);
}

if (migrated.calculationMeta?.engineVersion !== "0.3.0") {
  console.error(`迁移失败：engineVersion=${migrated.calculationMeta?.engineVersion}`);
  process.exit(1);
}

if (!migrated.note?.includes("[已自动迁移至引擎 v0.3.0]")) {
  console.error(`迁移失败：note=${migrated.note}`);
  process.exit(1);
}

console.log("旧命盘迁移测试通过: 1");
