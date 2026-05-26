import type { AiAnalysis } from "@/types/bazi";

export default function AiSummaryCard({ analysis }: { analysis: AiAnalysis }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">{analysis.title}</h2>
      </div>
      <p className="panel-body text-sm leading-7 text-slate-700">{analysis.summary}</p>
    </section>
  );
}
