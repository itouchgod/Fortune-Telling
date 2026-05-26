import type { DictionaryTerm } from "@/types/bazi";

export default function TermCard({ term, onOpen }: { term: DictionaryTerm; onOpen: (term: DictionaryTerm) => void }) {
  return (
    <button
      onClick={() => onOpen(term)}
      className="rounded-md border border-line bg-white p-4 text-left shadow-sm transition hover:border-jade"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-ink">{term.name}</h3>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{term.category}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{term.shortExplanation}</p>
    </button>
  );
}
