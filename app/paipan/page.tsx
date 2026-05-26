import { Suspense } from "react";
import PageContainer from "@/components/layout/PageContainer";
import BirthForm from "@/components/paipan/BirthForm";
import LoadingState from "@/components/common/LoadingState";

export default function PaipanPage() {
  return (
    <PageContainer
      title="排盘输入"
      description="填写出生信息后生成命盘。系统会按时区、真太阳时、子时换日和节气规则计算四柱。"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Suspense fallback={<LoadingState message="加载排盘表单..." />}>
          <BirthForm />
        </Suspense>
        <aside className="panel h-fit">
          <div className="panel-header">
            <h2 className="font-semibold text-ink">排盘说明</h2>
          </div>
          <div className="panel-body grid gap-3 text-sm leading-6 text-slate-600">
            <p>请选择出生城市或填写经纬度与时区，海外出生会按所选 UTC 偏移计算。</p>
            <p>年柱按立春换年，月柱按节气换月，不按公历月或农历月直接切换。</p>
            <p>真太阳时使用经度修正；均时差与历史夏令时仍需后续精校。</p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
