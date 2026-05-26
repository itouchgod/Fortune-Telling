import { buildBaziChart } from "../lib/bazi/index.ts";
import { baziTestCases, type BaziTestCase, type BaziTestTag } from "../lib/bazi/testCases.ts";

const tagArg = process.argv.find((arg) => arg.startsWith("--tag=")) ?? (process.argv.includes("--tag") ? `--tag=${process.argv[process.argv.indexOf("--tag") + 1]}` : "");
const tagFilter = tagArg ? (tagArg.replace("--tag=", "") as BaziTestTag) : null;
const cases = tagFilter ? baziTestCases.filter((testCase) => testCase.tags?.includes(tagFilter)) : baziTestCases;

let passed = 0;
const failures: string[] = [];
const tagStats = new Map<string, { total: number; passed: number }>();

cases.forEach((testCase, index) => {
  bumpTags(testCase, false);
  try {
    const chart = buildBaziChart(testCase.birthInfo, `test_${testCase.id || index}`);

    if (testCase.expectError) {
      failures.push(`${testCase.id} ${testCase.name}: expected error including "${testCase.errorIncludes ?? ""}", got success`);
      return;
    }

    const errors = [
      ...checkExpectedPillars(testCase, chart.pillars.map((pillar) => `${pillar.heavenlyStem}${pillar.earthlyBranch}`)),
      ...checkExpectedMeta(testCase, chart.calculationMeta)
    ];

    if (errors.length > 0) {
      failures.push(`${testCase.id} ${testCase.name}: ${errors.join("; ")}`);
      return;
    }

    passed += 1;
    bumpTags(testCase, true);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    if (testCase.expectError && (!testCase.errorIncludes || message.includes(testCase.errorIncludes))) {
      passed += 1;
      bumpTags(testCase, true);
      return;
    }
    failures.push(`${testCase.id} ${testCase.name}: ${message}`);
  }
});

console.log(`通过案例数: ${passed}`);
console.log(`失败案例数: ${failures.length}`);
console.log(`执行案例数: ${cases.length}`);
console.log("Tag 统计:");
Array.from(tagStats.entries())
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([tag, stat]) => console.log(`- ${tag}: ${stat.passed}/${stat.total}`));

if (failures.length > 0) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

if (!tagFilter && passed < 42) {
  console.error(`- 总通过数 ${passed} 小于验收要求 42`);
  process.exit(1);
}

function checkExpectedPillars(testCase: BaziTestCase, actual: string[]) {
  if (!testCase.expected) return [];
  const expected = testCase.expected;
  const expectedList = [expected.yearPillar, expected.monthPillar, expected.dayPillar, expected.hourPillar];
  if (expectedList.every((item, index) => item === actual[index])) return [];
  return [`expected ${expectedList.join(" ")}, got ${actual.join(" ")}`];
}

function checkExpectedMeta(testCase: BaziTestCase, meta: ReturnType<typeof buildBaziChart>["calculationMeta"]) {
  const expected = testCase.expectMeta;
  if (!expected) return [];
  const errors: string[] = [];
  if (expected.timezoneOffset !== undefined && Math.abs(meta.timezoneOffset - expected.timezoneOffset) > 0.001) {
    errors.push(`expected timezoneOffset ${expected.timezoneOffset}, got ${meta.timezoneOffset}`);
  }
  if (expected.isDst !== undefined && meta.isDst !== expected.isDst) {
    errors.push(`expected isDst ${expected.isDst}, got ${meta.isDst}`);
  }
  if (expected.warningIncludes && !meta.warnings.some((warning) => warning.includes(expected.warningIncludes))) {
    errors.push(`expected warning including "${expected.warningIncludes}", got ${meta.warnings.join(" | ")}`);
  }
  return errors;
}

function bumpTags(testCase: BaziTestCase, success: boolean) {
  testCase.tags?.forEach((tag) => {
    const current = tagStats.get(tag) ?? { total: 0, passed: 0 };
    if (!success) current.total += 1;
    if (success) current.passed += 1;
    tagStats.set(tag, current);
  });
}
