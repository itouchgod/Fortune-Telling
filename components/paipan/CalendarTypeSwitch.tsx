import type { CalendarType } from "@/types/bazi";

interface CalendarTypeSwitchProps {
  value: CalendarType;
  onChange: (value: CalendarType) => void;
}

export default function CalendarTypeSwitch({ value, onChange }: CalendarTypeSwitchProps) {
  return (
    <div className="grid grid-cols-2 rounded-md border border-line bg-slate-50 p-1">
      {[
        { value: "solar" as const, label: "公历" },
        { value: "lunar" as const, label: "农历" }
      ].map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`rounded px-3 py-2 text-sm ${value === item.value ? "bg-white text-jade shadow-sm" : "text-slate-600"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
