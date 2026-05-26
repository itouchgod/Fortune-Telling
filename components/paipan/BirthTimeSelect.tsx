interface BirthTimeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const timeOptions = [
  "00:30 子时",
  "01:30 丑时",
  "03:30 寅时",
  "05:30 卯时",
  "07:30 辰时",
  "09:30 巳时",
  "11:30 午时",
  "13:30 未时",
  "15:30 申时",
  "17:30 酉时",
  "19:30 戌时",
  "21:30 亥时",
  "23:30 晚子时"
];

export default function BirthTimeSelect({ value, onChange }: BirthTimeSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="focus-ring w-full rounded-md border border-line bg-white px-3 py-2"
    >
      {timeOptions.map((item) => (
        <option key={item} value={item.slice(0, 5)}>
          {item}
        </option>
      ))}
    </select>
  );
}
