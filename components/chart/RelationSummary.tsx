import type { BaziRelation } from "@/types/bazi";

export default function RelationSummary({ relations }: { relations: BaziRelation[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">原局关系</h2>
      </div>
      <div className="panel-body flex flex-wrap gap-2">
        {relations.length > 0 ? (
          relations.map((relation) => (
            <span key={`${relation.type}-${relation.source}-${relation.target}-${relation.description}`} className="rounded bg-cinnabar/10 px-3 py-1 text-sm text-cinnabar">
              {relation.description}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">原局暂无明显合冲刑害破关系</span>
        )}
      </div>
    </section>
  );
}
