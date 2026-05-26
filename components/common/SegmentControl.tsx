interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentControlProps<T extends string> {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
}

export default function SegmentControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel
}: SegmentControlProps<T>) {
  return (
    <div className="inline-flex rounded-md border border-line bg-slate-50 p-0.5" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`focus-ring rounded px-2.5 py-1 text-xs font-medium transition ${
              active ? "bg-white text-jade shadow-sm" : "text-slate-600 hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
