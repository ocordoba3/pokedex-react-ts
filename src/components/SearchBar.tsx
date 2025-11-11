type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
}: SearchBarProps) {
  return (
    <label className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.15)] focus-within:ring-2 focus-within:ring-rose-400">
      <svg
        className="h-5 w-5 text-rose-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="16.65" y1="16.65" x2="21" y2="21" />
      </svg>
      <input
        className="flex-1 bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
      />
      {value ? (
        <button
          type="button"
          className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500"
          onClick={() => onChange("")}
        >
          ×
        </button>
      ) : null}
    </label>
  );
}

export default SearchBar;
