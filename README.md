# 八字排盘网站

一个面向真实排盘、AI 解读和后续商业化扩展的八字排盘前端项目。当前版本为“可发布前的准确排盘验证版”：用户输入出生信息后，系统会生成唯一命盘 ID，计算四柱、十神、藏干、纳音、空亡、十二长生、五行统计、原局关系、大运和流年，并展示排盘依据。

本项目使用 `lunar-typescript` 作为基础历法能力，并在 `lib/bazi/` 中封装八字计算规则。当前结果已经具备基础校验机制，但仍需要结合目标流派和权威万年历继续人工复核，不应夸大为最终权威断盘结果。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- App Router
- lunar-typescript
- localStorage 本地缓存

## 当前功能

- 出生信息输入：姓名、性别、历法、日期、时间、出生地、经纬度、时区、真太阳时、子时换日规则
- 常用城市选择：北京、上海、广州、深圳、香港、台北、东京、新加坡、洛杉矶、纽约
- 设置默认值注入：默认历法、真太阳时、子时换日规则会自动进入排盘表单
- 基础真实排盘：年柱、月柱、日柱、时柱
- 排盘依据展示：历法、时区、真太阳时、子时规则、立春换年、节气换月、引擎版本、警告信息
- 命盘展示：十神、天干、地支、藏干、纳音、空亡、十二长生、神煞
- 五行分析：金木水火土计数、强弱、日主说明、取用参考
- 关系分析：天干五合、地支六合、六冲、六害、相刑、相破
- 大运流年：起运信息、顺逆、十年大运、当前大运、流年表、与原局关系
- 术语词典：搜索、分类筛选、详情弹窗
- 我的命盘：保存、搜索、筛选、备注编辑、删除
- 设置页：排盘规则、默认历法、真太阳时、子时换日、AI 偏好
- 首页双栏布局：主栏（四柱预览 + 出生表单）、侧栏（最近命盘、快捷入口、引擎说明）
- 首页快速排盘：姓名、性别、出生时间、真太阳时开关；预览区支持竖排/横排、简洁/标准切换与「现在」同步
- 完整出生地/历法/闰月请走顶部或侧栏「完整排盘」
- AI 页面：显示接入状态，不展示未经接入的自动分析
- 导出按钮：当前禁用，提示即将开放
- 校验脚本：`npm run test:bazi`

## 页面结构

- `/`：首页 / 快速排盘。左侧主栏：四柱预览（含布局/模式切换）+ 出生信息表单；右侧侧栏：最近命盘、快捷入口、引擎说明
- `/paipan`：排盘输入页，支持 `?date=` 与 `?time=` 预填出生时间
- `/chart/[id]`：排盘结果页
- `/chart/[id]/luck`：大运流年页
- `/chart/[id]/ai`：AI 分析页
- `/dictionary`：术语词典页
- `/my-charts`：我的命盘页
- `/settings`：设置页

## 目录结构

```text
app/
components/
  ai/
  chart/
  common/
  dictionary/
  layout/
  luck/
  paipan/
  user/
data/
  cities.ts
  dictionaryTerms.ts
lib/
  bazi/
    calendar.ts
    timezone.ts
    solarTime.ts
    solarToLunar.ts
    ganzhi.ts
    pillars.ts
    tenGod.ts
    wuxing.ts
    relations.ts
    dayun.ts
    shensha.ts
    validators.ts
    testCases.ts
    index.ts
scripts/
  test-bazi.mts
  ts-loader.mjs
services/
types/
utils/
```

## 数据结构

核心类型统一维护在 `types/bazi.ts`。

主要类型：

- `BirthInfo`：出生信息输入结构，包含时区、UTC 偏移和农历闰月参数
- `BaziChart`：完整命盘结构
- `CalculationMeta`：排盘依据和警告信息
- `BaziRelation`：合冲刑害破关系
- `Pillar`：四柱单柱结构
- `QiYunInfo`：起运信息
- `LuckCycle`：十年大运结构
- `LiuNian`：流年结构
- `DictionaryTerm`：术语词典结构
- `PaipanSettings`：排盘设置
- `AiProviderConfig` / `AiChatMessage`：AI 接入结构
- `UserProfile` / `CloudChartRecord`：用户与云端保存结构
- `MingShuReport` / `ExportJob`：命书和导出任务结构

## 本地运行

安装依赖：

```bash
npm install
```

开发模式：

```bash
npm run dev
```

如果本机文件监听数量较低，开发模式可能出现 `EMFILE: too many open files, watch`。这种情况不影响生产构建，可先使用生产预览。

生产预览：

```bash
npm run build
npm run start -- --port 3001
```

访问：

```text
http://localhost:3001
```

## 构建与验证

构建：

```bash
npm run build
```

排盘校验：

```bash
npm run test:bazi
```

安全审计：

```bash
npm audit --omit=dev
```

当前环境在线审计可能受 DNS 影响，可使用本地缓存审计：

```bash
npm audit --omit=dev --offline
```

当前验证结果：

- `npm run build` 通过
- `npm run test:bazi` 通过 51，失败 0，并包含旧命盘迁移测试
- `npm audit --omit=dev --offline` 为 `0 vulnerabilities`
  - 当前在线 `npm audit --omit=dev` 也已通过

## 排盘准确性说明

当前项目的准确性策略：

- 使用 `lunar-typescript` 提供基础历法、节气和干支能力
- 在 `lib/bazi/` 中封装八字业务规则
- 页面展示 `CalculationMeta`，让用户看到本次排盘依据
- 通过 `lib/bazi/testCases.ts` 维护可回归的校验案例

仍需说明：不同流派在子时换日、大运起运、神煞取法等方面可能存在差异。当前版本是工程化基础版本，仍需人工校验和流派规则配置。

## 时区处理说明

`BirthInfo` 包含：

- `timezone`
- `timezoneOffset`

城市数据位于 `data/cities.ts`，包含 IANA 时区名称与 UTC 标准偏移。排盘时优先通过 `@js-temporal/polyfill` 按出生日期解析真实 offset；例如洛杉矶夏季会解析为 UTC-7，冬季为 UTC-8。若 IANA 解析失败，会回退到城市默认 offset，并在排盘依据中写入警告。

## 真太阳时说明

真太阳时计算位于 `lib/bazi/solarTime.ts`。

公式：

```text
standardMeridian = timezoneOffset * 15
longitudeCorrectionMinutes = (longitude - standardMeridian) * 4
trueSolarTime = localTime + longitudeCorrectionMinutes + equationOfTimeCorrection
```

当前已接入简化均时差公式。开启真太阳时时，默认同时启用均时差修正；可在设置页关闭。

## 子时换日规则

支持两种：

- 子初换日：23:00 后算次日
- 子正换日：00:00 后算次日

该规则会影响日柱计算，尤其是 23:00-23:59 出生的命盘。

## 年柱与月柱规则

- 年柱按立春换年，不按公历新年或春节切换
- 月柱按节气换月，不按农历月份或公历月份直接切换

`pillars.ts` 中拆分了：

- `getYearPillarBySolarTerm()`
- `getMonthPillarBySolarTerm()`
- `getDayPillar()`
- `getHourPillar()`

## 农历闰月支持情况

`BirthInfo.isLeapMonth` 用于标记农历闰月。

当前通过 `lunar-typescript` 的负月份方式接入闰月。如果输入年份中不存在对应闰月，系统会给出可读错误提示，不会静默生成命盘。

## 测试案例

`lib/bazi/testCases.ts` 当前包含 51 个案例：

- 39 个回归四柱案例
- 4 个输入错误案例
- 11 个 DST / 时区相关案例
- 6 个真太阳时相关案例
- 5 个 meta 校验案例
- 1 个旧命盘迁移脚本案例

运行：

```bash
npm run test:bazi
```

输出：

- 通过案例数
- 失败案例数
- 失败原因

## AI 分析规划

当前 AI 页面不展示自动生成分析，避免用户误以为未接入的解读已经真实可用。

服务层已保留：

- `getAiProviderConfig()`
- `askAiQuestion(chartId, messages)`
- `generateReport(chartId)`

后续可支持：

- OpenAI
- DeepSeek
- 结构化命局分析
- 大运流年重点问题追问
- 完整命书生成
- 多轮上下文对话
- 用户偏好驱动的分析风格

## 当前限制

- 暂未处理历史夏令时
- 均时差修正入口已保留，当前为 0
- 喜用神仍为取用参考，不作为最终断语
- 神煞体系仍是基础集合
- 大运起运细节需按目标流派继续人工复核
- 农历闰月需要更多边界测试案例
- PDF / 图片导出尚未开放
- AI 分析尚未接入真实 provider

## 阶段 A 更新

阶段 A 将项目推进到“排盘可信度”验证阶段。

新增能力：

- 引擎版本升级到 `0.3.0`
- 接入 `@js-temporal/polyfill`
- 增加 IANA 时区与历史夏令时解析
- 增加均时差修正
- 设置页增加「均时差修正」开关
- 增加 `qiYunRule: "lunar-typescript-default"`
- 扩展测试框架，支持 `expectError`、tag 统计、`--tag dst`
- 增加旧命盘自动迁移：缺少 `calculationMeta` 或 `relations` 的旧命盘会在读取时重算并写回缓存

阶段 A 验证：

```bash
npm run test:bazi
```

输出应包含：

```text
通过案例数: 51
失败案例数: 0
旧命盘迁移测试通过: 1
```

## 后续规划

优先级较高：

- 增加更完整的城市库和时区系统
- 支持历史 DST 查询
- 增加节气临界分钟级测试案例
- 扩展排盘测试案例到 30+ 条
- 完善神煞体系和合冲刑害破关系
- 增加大运流年详细规则判断
- 增加真实喜用神计算
- 接入数据库和用户系统
- 实现云端保存
- 实现 PDF 导出与图片导出
- 接入 OpenAI / DeepSeek

## 开发约定

- 新类型统一写入 `types/bazi.ts`
- 新业务逻辑优先放入 `services/`
- 命理算法集中在 `lib/bazi/`
- 页面组件只负责展示和交互，不直接耦合算法
- 本地缓存通过 `utils/storage.ts` 封装
- 基础术语写入 `data/dictionaryTerms.ts`
- 新排盘规则必须补充测试案例
- 每个阶段完成后更新 `AGENT.md`
- 新增功能必须保证 `npm run build` 和 `npm run test:bazi` 通过
- UI 暂不做复杂视觉风格，优先保证功能结构和数据结构稳定
