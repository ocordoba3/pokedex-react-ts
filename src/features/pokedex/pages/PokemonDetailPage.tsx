import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getPokemonById } from "../api/pokemon";
import { PATHS } from "../../../app/router/utils/paths";
import useUiStore from "../../../app/store/ui-store";
import DetailContainer from "../components/details/DetailContainer";

function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { setIsLoading } = useUiStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Pokemon id missing");
      }
      return getPokemonById(id);
    },
    enabled: Boolean(id),
  });

  // Sync global loading state with local loading state
  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  if (isError) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // Render nothing while loading to show global loader
  if (isLoading) {
    return null;
  }

  // Handle case where data is not found
  // Prevents errors in DetailContainer when data is undefined
  if (!data) {
    return (
      <main className="w-full">
        <section className="rounded-3xl bg-white/10 p-10 text-center text-slate-200">
          Pokémon not found.
        </section>
      </main>
    );
  }

  return <DetailContainer />;
}

export default PokemonDetailPage;
