interface BirthPlaceInputProps {
  place: string;
  longitude: number;
  latitude: number;
  onPlaceChange: (value: string) => void;
  onLongitudeChange: (value: number) => void;
  onLatitudeChange: (value: number) => void;
}

export default function BirthPlaceInput({
  place,
  longitude,
  latitude,
  onPlaceChange,
  onLongitudeChange,
  onLatitudeChange
}: BirthPlaceInputProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_120px_120px]">
      <input
        value={place}
        onChange={(event) => onPlaceChange(event.target.value)}
        placeholder="出生地区，如 上海市"
        className="focus-ring rounded-md border border-line px-3 py-2"
      />
      <input
        type="number"
        step="0.01"
        value={longitude}
        onChange={(event) => onLongitudeChange(Number(event.target.value))}
        className="focus-ring rounded-md border border-line px-3 py-2"
        aria-label="经度"
      />
      <input
        type="number"
        step="0.01"
        value={latitude}
        onChange={(event) => onLatitudeChange(Number(event.target.value))}
        className="focus-ring rounded-md border border-line px-3 py-2"
        aria-label="纬度"
      />
    </div>
  );
}
