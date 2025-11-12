import { useSearchParams } from "react-router-dom";

type Props = {
  totalPages: number;
};

export function Pagination({ totalPages }: Props) {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const handlePageChange = (amount: number) => {
    if (
      isNaN(Number(page)) ||
      (page === 1 && amount === -1) ||
      (page === totalPages && amount === 1)
    ) {
      return;
    }
    setParams((prev) => {
      prev.set("page", (page + amount).toString());
      return prev;
    });
  };

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <div className="mt-6 flex items-center justify-between rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-[0_6px_20px_rgba(15,23,42,0.12)]">
      <button
        type="button"
        className="cursor-pointer rounded-full px-4 py-2 font-semibold text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => handlePageChange(-1)}
        disabled={isPrevDisabled}
      >
        Prev
      </button>
      <span>
        Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </span>
      <button
        type="button"
        className="cursor-pointer rounded-full px-4 py-2 font-semibold text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => handlePageChange(1)}
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
