import { cities, type CityLocation } from "@/data/cities";

interface CitySelectorProps {
  value: string;
  onSelect: (city: CityLocation) => void;
}

export default function CitySelector({ value, onSelect }: CitySelectorProps) {
  return (
    <select
      value={value}
      onChange={(event) => {
        const city = cities.find((item) => `${item.province}-${item.city}` === event.target.value);
        if (city) onSelect(city);
      }}
      className="focus-ring w-full rounded-md border border-line bg-white px-3 py-2"
    >
      <option value="">选择常用城市</option>
      {cities.map((city) => (
        <option key={`${city.province}-${city.city}`} value={`${city.province}-${city.city}`}>
          {city.province} · {city.city}
        </option>
      ))}
    </select>
  );
}
