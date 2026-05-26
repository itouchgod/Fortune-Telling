"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import TermSearch from "@/components/dictionary/TermSearch";
import TermList from "@/components/dictionary/TermList";
import TermDetailModal from "@/components/dictionary/TermDetailModal";
import LoadingState from "@/components/common/LoadingState";
import { getTerms } from "@/services/dictionaryApi";
import type { DictionaryTerm } from "@/types/bazi";

const categories = ["全部", "十神", "五行", "神煞", "合冲刑害", "十二长生", "纳音"];

function DictionaryPageContent() {
  const searchParams = useSearchParams();
  const [terms, setTerms] = useState<DictionaryTerm[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [activeTerm, setActiveTerm] = useState<DictionaryTerm | null>(null);

  useEffect(() => {
    getTerms().then(setTerms);
  }, []);

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery) setQuery(initialQuery);
  }, [searchParams]);

  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      const matchCategory = category === "全部" || term.category === category;
      const matchQuery = !query.trim() || `${term.name}${term.shortExplanation}${term.fullExplanation}`.includes(query.trim());
      return matchCategory && matchQuery;
    });
  }, [terms, category, query]);

  return (
    <PageContainer title="术语词典" description="支持分类筛选、搜索与详情弹窗。当前内置基础术语库，后续可继续扩展词条。">
      <div className="grid gap-4">
        <div className="panel p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <TermSearch value={query} onChange={setQuery} />
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${
                    category === item ? "bg-jade text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <TermList terms={filteredTerms} onOpen={setActiveTerm} />
      </div>
      <TermDetailModal term={activeTerm} onClose={() => setActiveTerm(null)} />
    </PageContainer>
  );
}

export default function DictionaryPage() {
  return (
    <Suspense fallback={<LoadingState message="加载术语词典..." />}>
      <DictionaryPageContent />
    </Suspense>
  );
}
