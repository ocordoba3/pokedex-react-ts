import type { SortOption, SortSelectOption } from "../interfaces/ui.interface";

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const options: Array<SortSelectOption> = [
  { label: "Number", value: "number" },
  { label: "Name", value: "name" },
];

export function SortSelect({ value, onChange }: Props) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.15)]">
      <p className="text-sm font-semibold text-slate-600">Sort by:</p>
      <div className="mt-3 space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 text-sm font-medium text-slate-700"
          >
            <input
              type="radio"
              name="sort"
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange(event.target.value as SortOption)}
              className="h-4 w-4 accent-rose-500"
            />
            {option.label}
          </label>
        ))}
      </div>
    </section>
  );
}

export default SortSelect;
