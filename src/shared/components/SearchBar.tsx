import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchIcon from "./icons/Search";

const DEBOUNCE_MS = 300;

export function SearchBar() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const [inputValue, setInputValue] = useState(search);

  const handleSearch = useCallback(
    (value: string) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (!value) {
          next.delete("search");
        } else {
          next.set("search", value);
        }
        next.delete("page");
        return next;
      });
    },
    [setParams],
  );

  // Debounce input changes
  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (inputValue !== search) {
        handleSearch(inputValue);
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(handle);
    };
  }, [inputValue, search, handleSearch]);

  return (
    <form
      role="search"
      className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-[inset_0_2px_8px_rgba(15,23,42,0.1)]"
    >
      <SearchIcon />
      <label htmlFor="search" className="sr-only">
        Search Pokémon
      </label>
      <input
        autoComplete="off"
        className="flex-1 bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
        id="search"
        name="search"
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search Pokémon..."
        type="text"
        value={inputValue}
      />
      {inputValue ? (
        <button
          aria-label="Clear search"
          type="button"
          className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 cursor-pointer"
          onClick={() => setInputValue("")}
        >
          ×
        </button>
      ) : null}
    </form>
  );
}

export default SearchBar;
