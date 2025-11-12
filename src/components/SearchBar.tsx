import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  debounceMs = 500,
}: Props) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(handle);
    };
  }, [inputValue, value, debounceMs, onChange]);

  const clear = () => setInputValue("");

  return (
    <label className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-[inset_0_2px_8px_rgba(15,23,42,0.1)]">
      <svg
        className="h-5 w-5 text-type-fighting"
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
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder={placeholder}
        type="text"
        autoComplete="off"
      />
      {inputValue ? (
        <button
          type="button"
          className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 cursor-pointer"
          onClick={clear}
        >
          ×
        </button>
      ) : null}
    </label>
  );
}

export default SearchBar;
