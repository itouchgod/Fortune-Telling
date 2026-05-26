interface TrueSolarTimeToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function TrueSolarTimeToggle({ checked, onChange }: TrueSolarTimeToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-line bg-white px-3 py-2">
      <span className="text-sm text-slate-700">使用真太阳时</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-jade"
      />
    </label>
  );
}
