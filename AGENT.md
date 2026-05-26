# AGENT.md

## 项目概览

这是一个“八字排盘网站”的前端项目，目标是支撑准确排盘、AI 解读、数据库保存和后续商业化扩展。当前版本为“可发布前的准确排盘验证版”：排盘逻辑集中在 `lib/bazi/`，页面通过 `services/` 调用，正式页面不再使用固定演示命盘。

技术栈：

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- App Router
- lunar-typescript

本地命令：

- 开发：`npm run dev`
- 构建：`npm run build`
- 排盘校验：`npm run test:bazi`
- 生产预览：`npm run build && npm run start -- --port 3001`

## 当前完成进度

已完成：

- 核心路由页面
- TypeScript 类型定义
- 组件拆分
- 真实四柱排盘基础引擎
- 时区、真太阳时、子时换日处理
- 农历闰月参数与校验
- 年柱立春换年
- 月柱节气换月
- 十神、藏干、纳音、空亡、十二长生
- 五行统计、日主强弱说明、取用参考
- 原局与大运流年的合冲刑害破关系
- 起运信息、十年大运、流年
- 唯一命盘 ID：`chart_XXXXXXXXXXXX`
- 多命盘缓存：`bazi.charts`
- 保存命盘：`bazi.savedCharts`
- 设置默认值注入排盘表单
- 城市选择器与时区、经纬度自动填充
- 统一空态、错误态、加载态
- AI 页面正式改为接入中状态
- 导出按钮禁用并提示即将开放
- 我的命盘只展示用户真实保存的本地命盘
- 基础术语库：`data/dictionaryTerms.ts`
- 排盘校验案例与 `npm run test:bazi`
- README.md 与 AGENT.md 更新
- 首页正式化：引擎版本展示、排盘规则摘要、功能分区、最近命盘、以此时间排盘跳转

验证结果：

- `npm run build` 已通过
- `npm run test:bazi`：通过 51，失败 0，并包含旧命盘迁移测试
- `npm audit --omit=dev --offline`：`0 vulnerabilities`
- `npm audit --omit=dev`：`0 vulnerabilities`

注意：开发模式曾出现 `EMFILE: too many open files, watch`，这是当前系统文件监听数量限制导致，不影响 webpack 构建和生产预览。`npm run build` 已固定使用 `next build --webpack`，避免当前环境下 Turbopack CSS 处理时的端口绑定限制。

## 路由结构

- `/`：首页 / 快速排盘入口
- `/paipan`：排盘输入页
- `/chart/[id]`：排盘结果页
- `/chart/[id]/luck`：大运流年页
- `/chart/[id]/ai`：AI 分析页
- `/dictionary`：术语词典页
- `/my-charts`：我的命盘页
- `/settings`：设置页

## 关键目录

- `app/`：Next.js App Router 页面
- `components/common/`：统一空态、错误态、加载态
- `components/layout/`：页面布局组件
- `components/paipan/`：排盘输入表单组件
- `components/chart/`：命盘展示组件
- `components/luck/`：大运流年组件
- `components/ai/`：AI 接入状态组件
- `components/dictionary/`：术语词典组件
- `components/user/`：我的命盘组件
- `types/bazi.ts`：核心 TypeScript 类型
- `data/cities.ts`：常用城市、时区、经纬度
- `data/dictionaryTerms.ts`：正式基础术语库
- `lib/bazi/`：排盘引擎
- `services/`：业务服务层与后端适配边界
- `utils/storage.ts`：`localStorage` 读写工具
- `scripts/test-bazi.mts`：排盘校验脚本

## 核心类型

核心类型位于 `types/bazi.ts`：

- `BirthInfo`
- `BaziChart`
- `CalculationMeta`
- `BaziRelation`
- `Pillar`
- `QiYunInfo`
- `LuckCycle`
- `LiuNian`
- `DictionaryTerm`
- `PaipanSettings`
- `AiProvider`
- `AiChatMessage`
- `AiProviderConfig`
- `UserProfile`
- `CloudChartRecord`
- `ExportJob`
- `MingShuReport`

后续接入真实后端时，优先保持这些类型稳定。如果真实接口返回结构不同，建议在 `services/` 中做适配，不要让页面组件直接耦合后端字段。

## 排盘准确性规则

当前规则：

- 出生时区：读取 `BirthInfo.timezone` 与 `BirthInfo.timezoneOffset`
- 时区标准经线：`timezoneOffset * 15`
- 真太阳时：当地标准时间 + 经度修正 + 均时差修正入口
- 经度修正：`(longitude - standardMeridian) * 4` 分钟
- 均时差：第一版保留参数，当前为 0
- 子初换日：23:00 后算次日
- 子正换日：00:00 后算次日
- 年柱：按立春换年
- 月柱：按节气换月
- 农历闰月：通过负月份接入 lunar-typescript；非法闰月会给出错误
- 大运顺逆：阳男阴女顺排，阴男阳女逆排
- 起运：使用 lunar-typescript 节气差基础结果，并记录“三天折一年、一天折四个月、一小时折五天”的依据
- 关系：支持天干五合、地支六合、六冲、六害、相刑、相破

仍需人工校验：

- 不同排盘流派的子时换日差异
- 不同流派的大运起运细节
- 历史夏令时和海外出生地时间换算
- 农历闰月边界案例
- 神煞体系和取用规则

## 命理引擎

目录：`lib/bazi/`

- `calendar.ts`：日期、时间解析和格式化
- `timezone.ts`：时区与标准经线
- `solarTime.ts`：真太阳时和子时换日
- `solarToLunar.ts`：公历/农历转换
- `ganzhi.ts`：天干地支、五行、藏干基础表
- `pillars.ts`：年柱、月柱、日柱、时柱构建
- `tenGod.ts`：十神关系计算
- `wuxing.ts`：五行计数、强弱描述、取用参考
- `relations.ts`：合冲刑害破关系
- `dayun.ts`：起运信息、十年大运、流年
- `shensha.ts`：基础神煞
- `validators.ts`：输入校验
- `testCases.ts`：排盘校验案例
- `index.ts`：统一导出 `buildBaziChart()`

当前 `services/paipanApi.ts` 会调用 `buildBaziChart()`。页面不直接依赖命理算法。

## 数据流

排盘主流程：

1. 用户进入 `/paipan`
2. `BirthForm` 读取 `bazi.settings`，注入默认历法、真太阳时、子时换日规则
3. 用户选择常用城市时，自动填充出生地、经纬度、IANA 时区和 UTC 偏移
4. 提交后调用 `services/paipanApi.ts` 的 `createChart(birthInfo)`
5. `createChart()` 调用 `normalizeBirthInfo()` 校验并补全命盘名
6. `createChart()` 生成 `chart_XXXXXXXXXXXX` 格式 ID
7. `createChart()` 调用 `lib/bazi/index.ts` 的 `buildBaziChart()`
8. 命盘写入 `localStorage` 的 `bazi.charts` 和兼容字段 `bazi.currentChart`
9. 页面跳转到 `/chart/[id]`
10. 结果页调用 `getChart(id)` 按 ID 读取命盘；找不到时展示“命盘不存在”

保存命盘：

1. 结果页点击“保存命盘”
2. 调用 `saveChart(id)`
3. 写入 `localStorage` 的 `bazi.savedCharts`
4. 同步写入 `bazi.charts`
5. `/my-charts` 读取并展示保存命盘

## API 与服务层

文件：

- `services/paipanApi.ts`
- `services/aiApi.ts`
- `services/dictionaryApi.ts`
- `services/authApi.ts`
- `services/databaseApi.ts`
- `services/exportApi.ts`
- `services/reportApi.ts`

主要方法：

- `createChart(birthInfo)`
- `getChart(id)`
- `saveChart(id)`
- `deleteChart(id)`
- `updateSavedChart(chart)`
- `getAiProviderConfig()`
- `askAiQuestion(chartId, messages)`
- `generateReport(chartId)`
- `getTerms()`
- `getTermById(id)`
- `getCurrentUser()`
- `login(email, password)`
- `register(name, email, password)`
- `syncChartToCloud(chart, ownerId)`
- `getCloudCharts(ownerId)`
- `exportChartPdf(chartId)`
- `exportChartImage(chartId)`
- `createMingShuReport(chartId)`

后续接真实后端时，建议只替换 `services/` 内部实现，页面和组件尽量不改。

## 2026-05-25 阶段更新：排盘准确性增强与页面正式化

本次新增功能：

- 新增 `calendar.ts`
- 新增 `timezone.ts`
- 新增 `solarTime.ts`
- 新增 `relations.ts`
- 新增 `validators.ts`
- 新增 `testCases.ts`
- 新增 `scripts/test-bazi.mts`
- 新增 `CalculationMetaCard`
- 新增 `RelationSummary`
- 城市数据增加 `timezone` 与 `timezoneOffset`
- `BirthInfo` 增加时区、UTC 偏移、农历闰月
- 排盘结果页增加“排盘依据”
- 大运流年页显示大运顺逆、起运依据与关系
- AI 页面改为“AI 分析功能正在接入中”
- 导出图片 / PDF 按钮禁用并提示即将开放
- 我的命盘不再自动写入固定命盘
- 术语库迁移到 `data/dictionaryTerms.ts`
- `data/mockChart.ts` 已移除，正式页面不再引用固定演示命盘

本次修改文件：

- `types/bazi.ts`
- `data/cities.ts`
- `data/dictionaryTerms.ts`
- `lib/bazi/*`
- `services/*`
- `components/paipan/BirthForm.tsx`
- `components/chart/*`
- `components/luck/*`
- `app/chart/[id]/*`
- `app/paipan/page.tsx`
- `app/my-charts/page.tsx`
- `app/dictionary/page.tsx`
- `app/settings/page.tsx`
- `README.md`
- `AGENT.md`
- `package.json`

类型变化：

- `BirthInfo` 增加 `timezone`、`timezoneOffset`、`isLeapMonth`
- `BaziChart` 增加 `calculationMeta`、`relations`
- `CalculationMeta` 新增
- `BaziRelation` 新增
- `LuckCycle` 增加 `relations`
- `LiuNian.relations` 改为 `BaziRelation[]`
- `QiYunInfo` 增加 `basis`
- `AiProvider` 改为 `openai | deepseek | disabled`

页面变化：

- 正式页面移除固定演示命盘
- 结果页新增排盘依据与原局关系
- 大运页新增起运依据与真实关系展示
- AI 页不展示自动生成文本，避免误导
- 导出功能以禁用状态展示
- 我的命盘为空时展示空态

已移除的演示内容：

- 固定命盘 ID
- 固定演示命盘数据
- AI 自动生成演示文案
- 大运页固定流月数据
- 首页与页面说明中的演示版文案

测试案例结果：

- 普通北京时间案例：通过
- 立春前年柱变化：通过
- 节气后月柱变化：通过
- 23 点子初换日：通过
- 海外城市时区案例：通过
- 总计：通过 5，失败 0

已知问题：

- 第一版暂未处理历史夏令时
- 均时差入口已保留，当前修正值为 0
- 大运起运细节仍需与目标流派人工复核
- 喜用神为取用参考，不作为最终断语
- 神煞体系仍是基础集合
- 农历闰月仍需增加更多边界校验案例
- `npm run test:bazi` 使用 Node 原生 TypeScript stripping，会输出实验性 loader 提示，不影响结果

下一步计划：

- 增加 IANA 时区与历史夏令时支持
- 扩展排盘测试案例到 30+ 条
- 增加节气临界分钟级案例
- 完善合冲刑害破对大运、流年、流月的统一关系图
- 接入真实 AI Provider 配置
- 实现服务端 PDF / 图片导出
- 接入用户系统与数据库

## 维护约定

- 新增命理字段时，先改 `types/bazi.ts`
- 页面不要直接读写 `localStorage`，优先通过 `utils/storage.ts` 或 `services/` 封装
- 后端接入尽量集中在 `services/`，保持组件展示层干净
- 命理算法集中在 `lib/bazi/`
- 基础术语写入 `data/dictionaryTerms.ts`
- 新增排盘规则必须补充 `lib/bazi/testCases.ts`
- 每个阶段完成后更新 `README.md` 与 `AGENT.md`
- 新增功能必须保证 `npm run build` 和 `npm run test:bazi` 通过

## 2026-05-26 阶段 A 更新：排盘可信度

本次新增功能：

- 引擎版本升级：`BAZI_ENGINE_VERSION = "0.3.0"`
- 新增生产依赖：`@js-temporal/polyfill`
- 新增 `lib/bazi/dst.ts`：按 IANA timezone 和出生日期解析真实 UTC offset 与 DST 状态
- 新增 `lib/bazi/equationOfTime.ts`：使用 NOAA 近似公式计算均时差分钟数
- `solarTime.ts` 接入均时差修正
- `timezone.ts` 接入 DST 解析，失败时回退城市默认 offset 并写 warning
- `solarToLunar.ts` 使用解析后的 offset 计算真太阳时
- 设置页增加「均时差修正」开关
- 表单读取 `useEquationOfTime` 设置
- 旧命盘读取时自动迁移到 v0.3.0
- `scripts/test-bazi.mts` 支持 `expectError`、tag 统计、`--tag dst`
- 新增 `scripts/test-chart-migration.mts`

本次修改文件：

- `types/bazi.ts`
- `lib/bazi/dst.ts`
- `lib/bazi/equationOfTime.ts`
- `lib/bazi/timezone.ts`
- `lib/bazi/solarTime.ts`
- `lib/bazi/solarToLunar.ts`
- `lib/bazi/index.ts`
- `lib/bazi/testCases.ts`
- `scripts/test-bazi.mts`
- `scripts/test-chart-migration.mts`
- `scripts/ts-loader.mjs`
- `services/paipanApi.ts`
- `components/paipan/BirthForm.tsx`
- `app/settings/page.tsx`
- `components/chart/CalculationMetaCard.tsx`
- `package.json`
- `README.md`
- `AGENT.md`

类型变化：

- `BirthInfo` 增加 `useEquationOfTime`
- `CalculationMeta` 增加 `equationOfTimeMinutes`、`isDst`、`timezoneOffsetLabel`
- `PaipanSettings` 增加 `useEquationOfTime`、`qiYunRule`

排盘准确性规则：

- 有 IANA timezone 时，根据出生地当地钟表时间解析该日期真实 offset
- 用户输入时间仍作为出生地 wall time，不转换成 UTC 后再算四柱
- DST 结果用于真太阳时标准经线、排盘依据和 warnings
- 真太阳时公式：当地钟表时间 + 经度修正 + 均时差修正
- 均时差默认随真太阳时开启，可在设置页关闭

测试案例结果：

- `npm run test:bazi`：通过 51，失败 0
- tag 统计：
  - dst: 11/11
  - lunar: 3/3
  - meta: 5/5
  - regression: 39/39
  - solar-term: 8/8
  - true-solar: 6/6
  - validation: 4/4
  - zi-hour: 5/5
- 旧命盘迁移测试：通过 1
- `npm run build`：通过
- `npm audit --omit=dev`：0 vulnerabilities

已知问题：

- 测试脚本使用 Node 原生 TypeScript stripping，会输出实验性 loader 提示，不影响结果
- DST 解析依赖运行环境的 ICU/Temporal 数据；异常时会回退到默认 offset
- 均时差采用近似公式，后续可替换为更高精度天文算法
- 大运起运算法保持 lunar-typescript 默认，本阶段未改

下一步计划：

- 将排盘案例扩展到 80+，覆盖更多节气临界分钟
- 为 DST 回退路径增加更多异常 timezone 测试
- 将测试 runner 的 TypeScript 执行方式迁移到稳定 loader 或编译后运行
- 建立与第三方权威万年历的人工验收表

## 2026-05-26 阶段 B 更新：首页正式化

本次新增功能：

- 首页文案与项目阶段同步，强调引擎 v0.3.0 与排盘依据透明
- 新增 `HomeFeatureSections`：已开放 / 即将开放功能分区
- 新增 `RecentChartsPanel`：展示最近 2 个本地保存命盘
- 及时盘增加「以此时间排盘」，直接调用 `createChart()` 生成命盘（默认性别男，使用所选时间与浏览器时区）
- 及时盘增加预览说明，明确与正式排盘规则差异
- 排盘表单支持 URL 参数预填出生日期与时间
- Footer 文案更新，展示引擎版本与流派差异说明

本次修改文件：

- `app/page.tsx`
- `app/paipan/page.tsx`
- `components/home/CurrentBaziClock.tsx`
- `components/home/HomeFeatureSections.tsx`
- `components/home/RecentChartsPanel.tsx`
- `components/paipan/BirthForm.tsx`
- `components/layout/Footer.tsx`
- `README.md`
- `AGENT.md`

页面变化：

- 首页主 CTA 改为「开始排盘」，新增「术语词典」入口
- 左栏增加排盘规则摘要与回归测试说明
- 右栏增加术语词典 / 排盘设置快捷入口
- 移动端及时盘优先展示（`order-1`）

已知问题：

- 及时盘仍使用 `lunar-typescript` 预览路径，尚未完全对齐 `buildBaziChart()` 的设置项
- 最近命盘仅读取 `bazi.savedCharts`，不含未保存的缓存命盘

下一步计划：

- 及时盘可选对齐用户设置中的真太阳时、子时换日规则
- 首页增加最近一次排盘（含未保存缓存）快捷入口
