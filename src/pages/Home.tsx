import { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getPokemons } from "../helpers/pokemon";
import Number from "../assets/icons/Number";
import Pagination from "../components/Pagination";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import SortName from "../assets/icons/SortName";
import SortSelect from "../components/SortSelect";
import type { PokemonListParams } from "../interfaces/pokemon.interface";
import type { SortOption } from "../interfaces/ui.interface";
import useMetaTags from "../hooks/useMetaTags";

const PAGE_LIMIT = 12;

function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("number");
  const [page, setPage] = useState(1);
  const [isSortOpen, setIsSortOpen] = useState(false);

  useMetaTags({
    title: "Pokédex | Home",
    description: "Browse and discover Pokémon in the Pokédex application.",
  });

  const queryParams = useMemo<PokemonListParams>(
    () => ({
      page,
      limit: PAGE_LIMIT,
      sort,
      search: search.trim() || undefined,
    }),
    [page, sort, search]
  );

  const { data, isLoading, error, isError, isFetching } = useQuery({
    queryKey: ["pokemons", queryParams],
    queryFn: () => getPokemons(queryParams),
    placeholderData: keepPreviousData,
  });

  const pokemons = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = (value: SortOption) => {
    setSort(value);
    setPage(1);
    setIsSortOpen(false);
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
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
    <section className="flex w-full flex-col px-2 sm:px-4 lg:px-0">
      <div className="bg-type-fighting p-4 text-white px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={handleSearch} />
          <button
            id="sort-options-button"
            type="button"
            className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-600 shadow-[inset_0_2px_8px_rgba(15,23,42,0.1)]"
            aria-label="Sort options"
            onClick={() => setIsSortOpen(true)}
          >
            {sort === "number" ? <Number /> : <SortName />}
          </button>
        </div>
      </div>

      <div className="bg-type-fighting p-8">
        <div className="bg-white rounded-4xl p-8 w-full ">
          <div className="flex-1 rounded-4xl bg-white p-4">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center text-base font-semibold text-slate-500">
                Loading Pokédex...
              </div>
            ) : isError ? (
              <div className="rounded-2xl bg-rose-50 p-6 text-rose-600">
                {(error as Error).message ||
                  "Unable to load Pokémon right now."}
              </div>
            ) : (
              <>
                {pokemons.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
                    No Pokémon found matching your filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-3">
                    {pokemons.map((pokemon) => (
                      <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                  </div>
                )}

                <div className="mt-4 text-right text-xs font-medium text-slate-400">
                  {isFetching ? "Refreshing..." : "\u00A0"}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {isSortOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsSortOpen(false)}
        >
          <div
            className="relative w-full max-w-xs rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <SortSelect value={sort} onChange={handleSort} />
            <button
              type="button"
              className="text-xl text-white bg-type-psychic w-full mt-4 rounded-lg cursor-pointer hover:bg-type-psychic/90 px-4 py-1"
              aria-label="Close sort options"
              onClick={() => setIsSortOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Home;
