import type { Gender, LiuNian, LuckCycle, Pillar, QiYunInfo } from "@/types/bazi";
import { getTenGod, isYangStem } from "@/lib/bazi/tenGod";
import { splitGanZhi } from "@/lib/bazi/ganzhi";
import { buildRelationsWithNatal } from "@/lib/bazi/relations";

export interface DayunOptions {
  rule: "yearStemGender";
}

export function buildLuckCycles(eightChar: import("lunar-typescript").EightChar, gender: Gender, natalPillars: Pillar[], options: DayunOptions = { rule: "yearStemGender" }) {
  const direction = getDayunDirection(eightChar.getYearGan(), gender, options);
  const lunarGender = gender === "female" ? 0 : 1;
  const yun = eightChar.getYun(lunarGender);
  const dayStem = eightChar.getDayGan();
  const daYun = yun.getDaYun(9).filter((cycle) => cycle.getGanZhi());

  const luckCycles: LuckCycle[] = daYun.map((cycle) => {
    const pillar = cycle.getGanZhi();
    const { gan } = splitGanZhi(pillar);
    return {
      startAge: cycle.getStartAge(),
      startYear: cycle.getStartYear(),
      pillar,
      tenGod: getTenGod(dayStem, gan),
      relations: buildRelationsWithNatal(`大运${pillar}`, pillar, natalPillars),
      years: cycle.getLiuNian(10).map<LiuNian>((year) => {
        const ganZhi = year.getGanZhi();
        return {
          year: year.getYear(),
          age: year.getAge(),
          ganZhi,
          tenGod: getTenGod(dayStem, splitGanZhi(ganZhi).gan),
          relations: buildRelationsWithNatal(`流年${ganZhi}`, ganZhi, natalPillars),
          note: "流年关系按原局四柱计算。"
        };
      })
    };
  });

  const qiYun: QiYunInfo = {
    startAge: yun.getStartYear(),
    startYear: daYun[0]?.getStartYear() ?? 0,
    startMonth: yun.getStartMonth(),
    startDay: yun.getStartDay(),
    startHour: yun.getStartHour(),
    direction,
    description: `${yun.getStartYear()}年${yun.getStartMonth()}个月${yun.getStartDay()}天${yun.getStartHour()}小时后起运，${direction === "forward" ? "顺排" : "逆排"}。`,
    basis: "按阳男阴女顺排、阴男阳女逆排；起运时间采用出生时刻到相邻节气的时间差，三天折一年、一天折四个月、一小时折五天。当前由 lunar-typescript 提供节气差基础结果。"
  };

  return {
    qiYun,
    luckCycles,
    currentLuckCycle: findCurrentLuckCycle(luckCycles, new Date().getFullYear())
  };
}

export function getDayunDirection(yearStem: string, gender: Gender, _options: DayunOptions = { rule: "yearStemGender" }): "forward" | "backward" {
  const yangYear = isYangStem(yearStem);
  const male = gender === "male";
  return (yangYear && male) || (!yangYear && !male) ? "forward" : "backward";
}

function findCurrentLuckCycle(cycles: LuckCycle[], year: number) {
  return cycles.find((cycle, index) => {
    const next = cycles[index + 1];
    return year >= cycle.startYear && (!next || year < next.startYear);
  });
}
