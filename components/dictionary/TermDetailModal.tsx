"use client";

import type { DictionaryTerm } from "@/types/bazi";

export default function TermDetailModal({ term, onClose }: { term: DictionaryTerm | null; onClose: () => void }) {
  if (!term) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4" role="dialog" aria-modal="true">
      <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-md bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">{term.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{term.category}</p>
          </div>
          <button onClick={onClose} className="focus-ring rounded-md border border-line px-3 py-1 text-sm">关闭</button>
        </div>
        <div className="grid gap-4 px-5 py-4 text-sm leading-7 text-slate-700">
          <p>{term.fullExplanation}</p>
          <div>
            <h3 className="font-medium text-ink">用例</h3>
            <ul className="mt-2 grid gap-2">
              {term.examples.map((item) => (
                <li key={item} className="rounded bg-slate-50 px-3 py-2">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
