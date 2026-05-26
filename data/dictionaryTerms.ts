import type { DictionaryTerm } from "@/types/bazi";

export const dictionaryTerms: DictionaryTerm[] = [
  {
    id: "ten-god-bi-jian",
    category: "十神",
    name: "比肩",
    shortExplanation: "与日主同五行同阴阳，代表自我、同辈、竞争与独立。",
    fullExplanation: "比肩常用于观察个人主观性、行动力、同辈关系以及竞争意识。实际解读需要结合旺衰、格局、大运流年共同判断。",
    examples: ["日主为戊土，天干再见戊土，可称比肩。"]
  },
  {
    id: "ten-god-pian-cai",
    category: "十神",
    name: "偏财",
    shortExplanation: "日主所克且同阴阳，常代表流动资源、机会、经营意识。",
    fullExplanation: "偏财不只等于钱，也常用来描述市场机会、外部资源、父缘线索和风险偏好。需结合命局结构判断其喜忌。",
    examples: ["戊土日主见壬水，为偏财。"]
  },
  {
    id: "wuxing-jin",
    category: "五行",
    name: "金",
    shortExplanation: "五行之一，象征规则、收敛、决断、结构。",
    fullExplanation: "金在命理中可对应规则、执行标准、技术、工具与输出能力。强弱判断需要看季节、透干、通根和组合。",
    examples: ["申、酉多见时，金气通常更明显。"]
  },
  {
    id: "wuxing-shui",
    category: "五行",
    name: "水",
    shortExplanation: "五行之一，象征流动、智慧、资源和财星线索。",
    fullExplanation: "水的作用依日主而异。对戊土而言，水为财星，可指资源、现金流、机会与现实收益。",
    examples: ["壬、癸、亥、子均属水。"]
  },
  {
    id: "shensha-tianyi",
    category: "神煞",
    name: "天乙贵人",
    shortExplanation: "常见吉神，象征助力、逢凶化吉的参考信号。",
    fullExplanation: "神煞为辅助信息，不宜脱离四柱组合独立定吉凶。天乙贵人多用于观察贵人缘、关键节点的支持条件。",
    examples: ["日柱或年柱取法不同，需按所用流派确定。"]
  },
  {
    id: "relation-chong",
    category: "合冲刑害",
    name: "冲",
    shortExplanation: "地支关系之一，常表示变动、冲突、迁移或结构被激活。",
    fullExplanation: "冲并非必凶，可能是变化、突破、搬迁、职业转换，也可能是矛盾加剧。需看被冲之支所代表的宫位和十神。",
    examples: ["子午冲、寅申冲、卯酉冲等。"]
  },
  {
    id: "changsheng-diwang",
    category: "十二长生",
    name: "帝旺",
    shortExplanation: "十二长生状态之一，表示气势旺盛、能量集中。",
    fullExplanation: "帝旺用于观察五行气势阶段。它不是独立吉凶标签，需结合日主喜忌和整体流通判断。",
    examples: ["戊土长生十二运中，午为帝旺。"]
  },
  {
    id: "nayin-jianfengjin",
    category: "纳音",
    name: "剑锋金",
    shortExplanation: "六十甲子纳音之一，多用于传统命理辅助象义。",
    fullExplanation: "纳音提供象义补充，可用于命名、合婚、古法判断等场景。现代排盘中通常作为辅助信息展示。",
    examples: ["壬申、癸酉纳音为剑锋金。"]
  },
  {
    id: "nayin-dayitu",
    category: "纳音",
    name: "大驿土",
    shortExplanation: "纳音之一，带有道路、承载、流通的象义。",
    fullExplanation: "大驿土常被解释为承载往来、平台与交通之象。具体解读仍需回到四柱本身。",
    examples: ["戊申、己酉纳音为大驿土。"]
  }
];
