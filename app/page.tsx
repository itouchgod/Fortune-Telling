import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";

const features = [
  "四柱、十神、藏干、纳音、空亡、长生、神煞展示",
  "五行数量、日主强弱、排盘依据",
  "大运流年、原局关系、流年关系",
  "AI 分析、术语词典、命盘保存与备注"
];

export default function HomePage() {
  return (
    <PageContainer>
      <section className="grid gap-8 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="text-sm font-medium text-jade">真实排盘基础版</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-ink md:text-5xl">八字排盘工具</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            完成输入、排盘结果、大运流年、AI 解读、术语词典、命盘管理与设置的完整页面结构，后续可直接替换服务层接入真实算法。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/paipan" className="focus-ring rounded-md bg-jade px-5 py-3 font-medium text-white">快速排盘</Link>
            <Link href="/my-charts" className="focus-ring rounded-md border border-line bg-white px-5 py-3 font-medium">我的命盘</Link>
          </div>
        </div>
        <div className="panel p-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {["年柱", "月柱", "日柱", "时柱"].map((label, index) => (
              <div key={label} className="rounded-md bg-slate-50 p-3">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-2 text-2xl font-semibold text-cinnabar">{["壬", "戊", "戊", "丁"][index]}</div>
                <div className="mt-1 text-2xl font-semibold text-jade">{["申", "申", "午", "巳"][index]}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            {features.map((item) => (
              <div key={item} className="rounded-md border border-line bg-white px-3 py-2 text-sm text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
