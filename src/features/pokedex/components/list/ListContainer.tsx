import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../../shared/components/Pagination";
import PokemonCard from "./PokemonCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getPokemons } from "../../api/pokemon";
import type { SortOption } from "../../interfaces/list.interface";
import type { PokemonListParams } from "../../interfaces/pokemon.interface";

const PAGE_LIMIT = 12;

const ListContainer = () => {
  const [params] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const sort = (params.get("sort") as SortOption) || "number";
  const search = params.get("search") || "";

  const queryParams = useMemo<PokemonListParams>(
    () => ({
      page,
      limit: PAGE_LIMIT,
      sort,
      search: search.trim() || undefined,
    }),
    [page, sort, search],
  );

  const { data, isError, isFetching } = useQuery({
    queryKey: ["pokemons", queryParams],
    queryFn: () => getPokemons(queryParams),
    placeholderData: keepPreviousData,
  });
  const pokemons = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const [hasLoaded, setHasLoaded] = useState(false);

  // Simulate a slight delay to trigger the fade-in effect
  useEffect(() => {
    const timeout = window.setTimeout(() => setHasLoaded(true), 100);
    return () => window.clearTimeout(timeout);
  }, []);

  // Show message if no results found or error occurred
  if ((isError || pokemons.length === 0) && !isFetching) {
    return (
      <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
        No Pokémon found matching your filters.
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid grid-cols-3 gap-2 md:gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 transition-opacity duration-1000 ease-out ${
          hasLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      <Pagination totalPages={totalPages} />
    </>
  );
};

export default ListContainer;
