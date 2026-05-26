interface TermSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TermSearch({ value, onChange }: TermSearchProps) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="搜索术语，如 比肩、冲、天乙贵人"
      className="focus-ring w-full rounded-md border border-line bg-white px-3 py-2"
    />
  );
}
