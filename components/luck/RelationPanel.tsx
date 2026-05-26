import type { BaziRelation } from "@/types/bazi";

export default function RelationPanel({ relations }: { relations: BaziRelation[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">合冲刑害破关系</h2>
      </div>
      <div className="panel-body flex flex-wrap gap-2">
        {relations.length > 0 ? (
          relations.map((item) => (
            <span key={`${item.source}-${item.target}-${item.description}`} className="rounded bg-cinnabar/10 px-3 py-1 text-sm text-cinnabar">
              {item.description}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">当前大运暂无明显关系</span>
        )}
      </div>
    </section>
  );
}
