import { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getPokemons } from "../helpers/pokemon";
import NumberIcon from "../assets/icons/Number";
import Pagination from "../components/Pagination";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import SortName from "../assets/icons/SortName";
import SortSelect from "../components/SortSelect";
import type { PokemonListParams } from "../interfaces/pokemon.interface";
import type { SortOption } from "../interfaces/ui.interface";
import useMetaTags from "../hooks/useMetaTags";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../utils/seo";

const PAGE_LIMIT = 12;

function Home() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const sort = (params.get("sort") as SortOption) || "number";
  const search = params.get("search") || "";
  const [isSortOpen, setIsSortOpen] = useState(false);

  const queryParams = useMemo<PokemonListParams>(
    () => ({
      page,
      limit: PAGE_LIMIT,
      sort,
      search: search.trim() || undefined,
    }),
    [page, sort, search]
  );

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["pokemons", queryParams],
    queryFn: () => getPokemons(queryParams),
    placeholderData: keepPreviousData,
  });
  const pokemons = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const hasActiveFilters = Boolean(search.trim());
  const pageTitle = hasActiveFilters
    ? `Pokédex | Results for “${search.trim()}”`
    : "Pokédex | Home";
  const metaDescription = hasActiveFilters
    ? `${pokemons.length || 0} Pokémon match “${search.trim()}”. Refine filters or change the sort order to find your favorites faster.`
    : SITE_DESCRIPTION;

  useMetaTags({
    title: pageTitle,
    description: metaDescription,
    image: DEFAULT_OG_IMAGE,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: pageTitle,
      description: metaDescription,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
      },
      numberOfItems: pokemons.length,
    },
  });

  const handleSearch = (value: string) => {
    setParams((prev) => {
      if (!value) {
        prev.delete("search");
      } else {
        prev.set("search", value);
      }
      prev.delete("page");
      return prev;
    });
  };

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
    <section className="flex w-full flex-col">
      <div className="bg-type-fighting px-4 md:px-8 text-white pb-4 md:pb-8">
        <div className="flex gap-4 items-center">
          <SearchBar value={search} onChange={handleSearch} />
          <button
            id="sort-options-button"
            type="button"
            className="cursor-pointer flex p-2 items-center justify-center rounded-full bg-white text-rose-600 shadow-[inset_0_2px_8px_rgba(15,23,42,0.1)]"
            aria-label="Sort options"
            onClick={() => setIsSortOpen(true)}
          >
            {sort === "number" ? <NumberIcon /> : <SortName />}
          </button>
        </div>
      </div>

      <div className="bg-type-fighting p-2 md:p-8">
        <div className="bg-white rounded-xl p-4 md:p-8 w-full ">
          <div className="flex-1 rounded-4xl bg-white">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center text-base font-semibold text-slate-500">
                Loading Pokédex...
              </div>
            ) : isError ? (
              <div className="rounded-2xl bg-rose-50 p-6 text-type-fighting">
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
                  <div className="grid grid-cols-3 gap-2 md:gap-8 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
                    {pokemons.map((pokemon) => (
                      <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                  </div>
                )}

                <Pagination totalPages={totalPages} />
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
          <SortSelect value={sort} onChange={handleSort} />
        </div>
      ) : null}
    </section>
  );
}

export default Home;
