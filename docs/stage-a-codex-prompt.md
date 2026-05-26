# 阶段 A — Codex 执行提示词

> 将下方「---COPY START---」到「---COPY END---」整段复制给 Codex / Cursor Agent 执行。

---COPY START---

## 任务：八字排盘项目 — 阶段 A（排盘可信度）

你在仓库 `/Users/roger/Documents/fortune-telling`（Next.js 16 + TypeScript + lunar-typescript）中实现 **阶段 A**。先阅读 `AGENT.md`、`README.md`，再改代码。

### 总体验收（必须全部通过）

```bash
npm run test:bazi   # 通过 ≥42，失败 0（含错误案例）
npm run build
```

引擎版本 bump：`lib/bazi/index.ts` 中 `BAZI_ENGINE_VERSION` → `0.3.0`。

---

## A1. 扩展测试框架（`lib/bazi/testCases.ts` + `scripts/test-bazi.mts`）

### 1.1 扩展 `BaziTestCase` 类型

```ts
export interface BaziTestCase {
  id: string;
  name: string;
  birthInfo: BirthInfo;
  expected?: { yearPillar: string; monthPillar: string; dayPillar: string; hourPillar: string };
  expectError?: boolean;
  errorIncludes?: string; // 错误信息需包含的子串
  tags?: Array<"regression" | "solar-term" | "zi-hour" | "lunar" | "dst" | "true-solar" | "validation" | "meta">;
  source?: string;
}
```

### 1.2 回归案例（35 条，期望四柱不得改，除非修复明显 bug）

保留现有 5 条（`TC-LEGACY-01`…`05`），并新增下表（格式：`id | 日期 时间 | 年|月|日|时`）：

| id | birthDate birthTime | 年 | 月 | 日 | 时 | 备注 |
|----|---------------------|----|----|----|----|------|
| TC01 | 1990-05-20 08:00 | 庚午 | 辛巳 | 乙酉 | 庚辰 | 北京默认 |
| TC02 | 1988-12-01 14:30 | 戊辰 | 癸亥 | 庚寅 | 癸未 | gender: female |
| TC03 | 2000-06-15 09:00 | 庚辰 | 壬午 | 甲辰 | 己巳 | 香港 Asia/Hong_Kong |
| TC04 | 1995-03-20 07:15 | 乙亥 | 己卯 | 庚戌 | 庚辰 | 东京 offset 9 |
| TC05 | 2024-02-04 16:27 | 癸卯 | 乙丑 | 戊戌 | 庚申 | 立春前1分钟 tag:solar-term |
| TC06 | 2024-02-04 16:28 | 甲辰 | 丙寅 | 戊戌 | 庚申 | 立春后1分钟 |
| TC07 | 2024-03-05 10:22 | 甲辰 | 丙寅 | 戊辰 | 丁巳 | 惊蛰前1分钟 |
| TC08 | 2024-03-05 10:23 | 甲辰 | 丁卯 | 戊辰 | 丁巳 | 惊蛰后1分钟 |
| TC09 | 2024-05-10 23:30 | 甲辰 | 己巳 | 乙亥 | 戊子 | ziHourRule: earlyZi |
| TC10 | 2024-05-10 23:59 | 甲辰 | 己巳 | 乙亥 | 戊子 | earlyZi |
| TC11 | 2024-05-10 23:30 | 甲辰 | 己巳 | 甲戌 | 丙子 | lateZi |
| TC12 | 2024-05-11 00:30 | 甲辰 | 己巳 | 乙亥 | 丙子 | lateZi |
| TC13 | 2023-02-15 12:00 | 癸卯 | 乙卯 | 癸亥 | 戊午 | calendarType: lunar, isLeapMonth: false |
| TC14 | 2023-02-15 12:00 | 癸卯 | 丙辰 | 癸巳 | 戊午 | lunar + isLeapMonth: true |
| TC15 | 1990-01-15 10:00 | 己巳 | 丁丑 | 庚辰 | 辛巳 | LA, offset -8 |
| TC16 | 1990-07-15 10:00 | 庚午 | 癸未 | 辛巳 | 癸巳 | LA 夏 |
| TC17 | 2024-01-15 10:00 | 癸卯 | 乙丑 | 戊寅 | 丁巳 | NY 冬 |
| TC18 | 2024-07-15 10:00 | 甲辰 | 辛未 | 庚辰 | 辛巳 | NY 夏 |
| TC19 | 1992-08-18 09:30 | 壬申 | 戊申 | 丙寅 | 癸巳 | 上海 useTrueSolarTime: true |
| TC20 | 2000-06-21 11:55 | 庚辰 | 壬午 | 庚戌 | 壬午 | 北京 useTrueSolarTime: true |
| TC21 | 2023-12-22 12:00 | 癸卯 | 甲子 | 甲寅 | 庚午 | |
| TC22 | 2024-06-21 12:00 | 甲辰 | 庚午 | 丙辰 | 甲午 | |
| TC23 | 1999-12-31 23:50 | 己卯 | 丙子 | 丁巳 | 壬子 | |
| TC24 | 2000-01-01 00:10 | 己卯 | 丙子 | 戊午 | 壬子 | |
| TC25 | 1985-07-07 02:30 | 乙丑 | 壬午 | 丁未 | 辛丑 | |
| TC26 | 1976-11-11 12:00 | 丙辰 | 己亥 | 丁卯 | 丙午 | |
| TC27 | 1993-09-09 21:45 | 癸酉 | 辛酉 | 癸巳 | 癸亥 | |
| TC28 | 1980-04-04 06:00 | 庚申 | 己卯 | 丁未 | 癸卯 | 新加坡 |
| TC29 | 1978-08-08 18:20 | 戊午 | 庚申 | 壬寅 | 己酉 | 台北 |
| TC30 | 2001-01-01 00:05 | 庚辰 | 戊子 | 甲子 | 甲子 | 深圳 |
| TC31 | 1996-06-06 15:15 | 丙子 | 甲午 | 甲戌 | 壬申 | 广州 |
| TC32 | 1992-08-18 09:30 | 壬申 | 戊申 | 丙寅 | 癸巳 | 上海（与 LEGACY 重复可合并） |
| TC33 | 2024-02-04 10:00 | 癸卯 | 乙丑 | 戊戌 | 丁巳 | 立春日上午不应换年 |
| TC34 | 2024-03-05 09:00 | 甲辰 | 丙寅 | 戊辰 | 丁巳 | 惊蛰日上午不应换月 |

经纬度/时区：未注明则用北京 `116.4, 39.9, Asia/Shanghai, 8`。

### 1.3 错误案例（4 条，`expectError: true`）

| id | 输入要点 | errorIncludes |
|----|----------|---------------|
| ERR01 | lunar 2023-03-15 + isLeapMonth: true | 闰月 |
| ERR02 | birthDate 1899-01-01 | 1900 |
| ERR03 | birthDate 2024-02-30 | 无效 |
| ERR04 | timezoneOffset: undefined / NaN | 时区 |

### 1.4 DST + 真太阳时案例（接入 A2 后生效）

| id | 输入 | 期望四柱（全年柱） |
|----|------|-------------------|
| DST01 | LA 1990-07-15 11:50, America/Los_Angeles, useTrueSolarTime: true, **由引擎解析 offset=-7** | 庚午 癸未 辛巳 **癸巳** |
| DST02 | 同上但 **错误** 固定 offset=-8（测试应失败或 warnings 标明 DST 未启用） | 时柱 **甲午**（当前错误行为，接入后 DST01 与 DST02 必须不同） |

`scripts/test-bazi.mts` 需支持：`expectError`、按 tag 统计、`--tag dst` 可选过滤。

---

## A2. IANA 时区 + 历史夏令时

### 依赖

添加生产依赖：`@js-temporal/polyfill`（或 `luxon`，二选一，优先 Temporal）。

### 新文件 `lib/bazi/dst.ts`

```ts
export interface ResolvedTimezone {
  timezone: string;
  timezoneOffset: number;      // 含 DST 的小时偏移，如 -7
  isDst: boolean;
  offsetLabel: string;         // 如 "UTC-7 (PDT)"
}

export function resolveTimezoneOffset(
  timezone: string,
  localDate: Date,
  fallbackOffset?: number
): ResolvedTimezone;
```

规则：

- 有 `birthInfo.timezone`（IANA）时，按 `birthDate + birthTime` 查该时刻真实 offset。
- 查不到时回退 `birthInfo.timezoneOffset`，`warnings` 写明回退原因。
- **用户输入的是出生地当地钟表时间**（wall time），不要把 wall time 再转 UTC 去算四柱；DST 主要用于：`calculationMeta`、真太阳时标准经线、warnings。

### 修改 `lib/bazi/timezone.ts`

`resolveTimezone(birthInfo, localDate?)` 调用 `dst.ts`。

### 修改 `lib/bazi/solarToLunar.ts`

- 用解析后的 offset 传入 `applyTrueSolarTime`。
- 删除或更新 warning「第一版暂未处理历史夏令时」→ 改为展示 `offsetLabel` 与 `isDst`。

### 修改 `data/cities.ts`

保留 `timezoneOffset` 作默认值；排盘时以 IANA + 日期覆盖。

### 单元测试

新增 `lib/bazi/dst.testCases.ts` 或在 testCases 中加 tag `dst`：

- `America/Los_Angeles` + `1990-07-15` → offset **-7**, isDst **true**
- `America/Los_Angeles` + `1990-01-15` → offset **-8**, isDst **false**
- `America/New_York` + `2024-07-15` → offset **-4**, isDst **true**
- `Asia/Shanghai` + 任意日期 → offset **8**, isDst **false**

---

## A3. 均时差（Equation of Time）

### 新文件 `lib/bazi/equationOfTime.ts`

```ts
/** 返回分钟数，夏令时场景下加到真太阳时 */
export function getEquationOfTimeMinutes(date: Date): number;
```

实现：可用简化 Fourier 公式（精度够用于排盘），文档注释公式来源。

### 修改 `lib/bazi/solarTime.ts`

- `useTrueSolarTime === true` 时默认传入 `getEquationOfTimeMinutes(localTime)`（可通过 `BirthInfo` 或 settings 关闭，见 A4）。
- `CalculationMeta` 增加可选字段 `equationOfTimeMinutes: number`（改 `types/bazi.ts`）。

### 测试

新增 2 条 tag `true-solar`：夏至/冬至附近 `useTrueSolarTime: true`，期望四柱与 `docs/stage-a-codex-prompt.md` 实施后用脚本生成值一致（实施者运行 `npm run test:bazi` 自洽即可）。

---

## A4. 流派配置（子时规则已有，补充起运展示配置）

### 扩展 `PaipanSettings`（`types/bazi.ts`）

```ts
export interface PaipanSettings {
  useTrueSolarTime: boolean;
  useEquationOfTime: boolean;  // 默认 true（当 useTrueSolarTime 时）
  ziHourRule: ZiHourRule;
  defaultCalendar: CalendarType;
  qiYunRule: "lunar-typescript-default"; // 预留枚举
  aiPreference: string;
  paipanRule: string;
}
```

### UI `app/settings/page.tsx` + `components/paipan/BirthForm.tsx`

- 增加「均时差修正」开关，写入 `bazi.settings`。
- `paipanRule` 可显示只读说明：「年柱立春 / 月柱节气 / 起运按 lunar-typescript」。

### 引擎

`buildBaziChart` 读取 settings（通过 `normalizeBirthInfo` 或 optional 参数注入），不要破坏现有 API。

---

## A5. 旧命盘迁移

### 修改 `services/paipanApi.ts` — `getChart(id)`

1. 读取 cache 后若缺 `calculationMeta` 或 `relations`：
   - 若有完整 `basicInfo`（BirthInfo 字段齐全）：调用 `buildBaziChart(basicInfo, id)` **重新计算**并 `upsertChartCache`，返回新 chart。
   - 否则返回 `null`（页面继续显示「命盘不存在」）。
2. 重新计算时 `note` 追加：`[已自动迁移至引擎 v0.3.0]`。

### 测试

新增 `scripts/test-chart-migration.mts`（或扩展现有脚本）：构造缺 meta 的 mock chart JSON，断言 `getChart` 迁移成功。

---

## 非目标（本阶段不要做）

- 不接真实 AI / 后端 / PDF 导出
- 不改大运起运算法（保持 lunar-typescript）
- 不大改 UI 视觉

---

## 文档

完成后更新 `AGENT.md`、`README.md` 阶段 A 小节：测试数量、DST、均时差、迁移行为。

---

## 提交信息建议

```
feat(bazi): stage A — expand tests, DST, equation of time, chart migration
```

---COPY END---
