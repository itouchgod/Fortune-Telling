export default function AiAnalysisSection({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-md border border-line bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{content}</p>
    </section>
  );
}
