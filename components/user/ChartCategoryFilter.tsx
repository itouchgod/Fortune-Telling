interface ChartCategoryFilterProps {
  value: string;
  categories: string[];
  onChange: (value: string) => void;
}

export default function ChartCategoryFilter({ value, categories, onChange }: ChartCategoryFilterProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="focus-ring rounded-md border border-line bg-white px-3 py-2 text-sm"
    >
      <option value="全部">全部分类</option>
      {categories.map((category) => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  );
}
