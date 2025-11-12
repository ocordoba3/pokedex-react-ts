import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar";
import SortSelect, { type SortOption } from "../components/SortSelect";
import PokemonCard from "../components/PokemonCard";
import Pagination from "../components/Pagination";
import { getPokemons } from "../helpers/pokemon";
import type { PokemonListParams } from "../interfaces/pokemon.interface";
import useMetaTags from "../hooks/useMetaTags";

const PAGE_LIMIT = 12;

function Home() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("number");
  const [page, setPage] = useState(1);

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
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-2 pb-10 pt-4 sm:px-4 lg:px-0">
      <div className="rounded-[28px] bg-rose-600 p-5 text-white shadow-[0_25px_45px_rgba(225,29,72,0.45)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">Pokédex</p>
            <p className="text-sm text-rose-100">
              Track every Pokémon you love
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl">
            🕹️
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={handleSearch} />
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-rose-600 shadow-[0_6px_20px_rgba(15,23,42,0.15)]"
            aria-label="Sort options"
          >
            #
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 rounded-4xl bg-white p-4 shadow-[0_25px_45px_rgba(15,23,42,0.15)]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-base font-semibold text-slate-500">
              Loading Pokédex...
            </div>
          ) : isError ? (
            <div className="rounded-2xl bg-rose-50 p-6 text-rose-600">
              {(error as Error).message || "Unable to load Pokémon right now."}
            </div>
          ) : (
            <>
              {pokemons.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
                  No Pokémon found matching your filters.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
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

        <div className="lg:w-64">
          <SortSelect value={sort} onChange={handleSort} />
        </div>
      </div>
    </section>
  );
}

export default Home;
