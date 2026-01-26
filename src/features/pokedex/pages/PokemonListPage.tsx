import { useSearchParams } from "react-router-dom";

import {
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
} from "../../../app/seo/helpers/seo";
import SearchBar from "../../../shared/components/SearchBar";
import useMetaTags from "../../../app/seo/hooks/useMetaTags";
import SortTrigger from "../components/list/SortTrigger";
import ListContainer from "../components/list/ListContainer";

function PokemonListPage() {
  const [params] = useSearchParams();
  const search = params.get("search") || "";

  const hasActiveFilters = Boolean(search.trim());
  const pageTitle = hasActiveFilters
    ? `Pokédex | Results for “${search.trim()}”`
    : "Pokédex | Home";

  useMetaTags({
    title: pageTitle,
    description: SITE_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: pageTitle,
      description: SITE_DESCRIPTION,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
      },
    },
  });

  return (
    <main className="flex w-full flex-col bg-type-fighting min-h-[calc(100vh-60px)]">
      <header className=" px-4 md:px-8 text-white pb-4 md:pb-8">
        <h1 className="sr-only">Pokédex</h1>
        <div className="flex gap-4 items-center">
          <SearchBar />
          <SortTrigger />
        </div>
      </header>

      <section className="pt-0 px-2 pb-2 md:pb-8 md:px-8">
        <div className="bg-white rounded-xl p-4 w-full ">
          <ListContainer />
        </div>
      </section>
    </main>
  );
}

export default PokemonListPage;
