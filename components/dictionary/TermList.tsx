import type { DictionaryTerm } from "@/types/bazi";
import TermCard from "@/components/dictionary/TermCard";

export default function TermList({ terms, onOpen }: { terms: DictionaryTerm[]; onOpen: (term: DictionaryTerm) => void }) {
  if (terms.length === 0) {
    return <div className="rounded-md border border-dashed border-line p-8 text-center text-sm text-slate-500">没有找到匹配术语</div>;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {terms.map((term) => (
        <TermCard key={term.id} term={term} onOpen={onOpen} />
      ))}
    </div>
  );
}
