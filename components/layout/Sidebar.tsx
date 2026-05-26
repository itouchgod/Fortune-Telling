"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  chartId?: string;
}

export default function Sidebar({ chartId = "" }: SidebarProps) {
  const pathname = usePathname();
  const items = [
    { href: `/chart/${chartId}`, label: "命盘结果" },
    { href: `/chart/${chartId}/luck`, label: "大运流年" },
    { href: `/chart/${chartId}/ai`, label: "AI 分析" },
    { href: "/dictionary", label: "术语词典" }
  ];

  return (
    <aside className="panel p-2 md:sticky md:top-24">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm transition ${
              pathname === item.href ? "bg-ink text-white" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
