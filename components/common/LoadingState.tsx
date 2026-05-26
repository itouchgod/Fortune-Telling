interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "正在加载..." }: LoadingStateProps) {
  return (
    <div className="rounded-md border border-line bg-white p-6 text-center text-sm text-slate-600">
      <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-jade" />
      {message}
    </div>
  );
}
