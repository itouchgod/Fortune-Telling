import type { Gender } from "@/types/bazi";

interface GenderSelectProps {
  value: Gender;
  onChange: (value: Gender) => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as Gender)}
      className="focus-ring w-full rounded-md border border-line bg-white px-3 py-2"
    >
      <option value="unknown">未指定</option>
      <option value="male">男</option>
      <option value="female">女</option>
    </select>
  );
}
