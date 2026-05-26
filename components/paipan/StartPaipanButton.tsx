interface StartPaipanButtonProps {
  loading?: boolean;
}

export default function StartPaipanButton({ loading = false }: StartPaipanButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="focus-ring w-full rounded-md bg-jade px-4 py-3 font-medium text-white transition hover:bg-jade/90 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {loading ? "正在排盘..." : "开始排盘"}
    </button>
  );
}
