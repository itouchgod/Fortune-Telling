interface ErrorStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export default function ErrorState({ title = "出现问题", message, action }: ErrorStateProps) {
  return (
    <div className="rounded-md border border-cinnabar/30 bg-cinnabar/5 p-6 text-center">
      <h2 className="font-semibold text-cinnabar">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">{message}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
