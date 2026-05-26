import { BAZI_ENGINE_VERSION } from "@/lib/bazi/index";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <span>八字排盘工具 · 引擎 v{BAZI_ENGINE_VERSION}</span>
        <span>真实排盘基础版。不同流派规则可能存在差异，AI 与导出能力将分阶段开放。</span>
      </div>
    </footer>
  );
}
