interface EmptyStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title = "暂无数据", message, action }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white p-8 text-center">
      <h2 className="font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
