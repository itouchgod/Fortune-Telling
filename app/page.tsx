import Link from "next/link";
import HomePaipanWorkspace from "@/components/home/HomePaipanWorkspace";
import HomeSidebar from "@/components/home/HomeSidebar";
import PageContainer from "@/components/layout/PageContainer";

export default function HomePage() {
  return (
    <PageContainer
      title="八字排盘"
      description="输入出生信息即可生成四柱命盘。预览区实时显示干支，侧栏可快速打开最近记录。"
      actions={
        <Link href="/paipan" className="focus-ring rounded-md border border-line bg-white px-4 py-2 text-sm font-medium">
          完整排盘
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <HomePaipanWorkspace />
        <HomeSidebar />
      </div>
    </PageContainer>
  );
}
