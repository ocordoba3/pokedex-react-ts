import { useSearchParams } from "react-router-dom";
import NumberIcon from "../../../../shared/components/icons/NumberIcon";
import SortNameIcon from "../../../../shared/components/icons/SortName";
import type { SortOption } from "../../interfaces/list.interface";
import SortSelect from "./SortSelect";
import { useEffect, useState } from "react";

const SortTrigger = () => {
  const [params, setParams] = useSearchParams();
  const sort = (params.get("sort") as SortOption) || "number";
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleSort = (value: SortOption) => {
    setParams((prev) => {
      prev.set("sort", value);
      prev.delete("page");
      return prev;
    });
    setIsSortOpen(false);
  };

  useEffect(() => {
    if (!isSortOpen) return undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSortOpen]);

  return (
    <>
      <button
        aria-label="Sort options"
        className="cursor-pointer flex p-2 items-center justify-center rounded-full bg-white text-rose-600 shadow-[inset_0_2px_8px_rgba(15,23,42,0.1)]"
        id="sort-options-button"
        onClick={() => setIsSortOpen(true)}
        type="button"
      >
        {sort === "number" ? <NumberIcon /> : <SortNameIcon />}
      </button>

      {isSortOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsSortOpen(false)}
          role="dialog"
        >
          <SortSelect value={sort} onChange={handleSort} />
        </div>
      ) : null}
    </>
  );
};

export default SortTrigger;
