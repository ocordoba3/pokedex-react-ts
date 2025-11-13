import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getPokemonById } from "../api/pokemon";
import { PATHS } from "../../../app/router/utils/paths";
import {
  TYPE_BG_CLASS_MAP,
  TYPE_BG_OPACITY_MAP,
  TYPE_TEXT_COLOR_CLASS_MAP,
} from "../../../shared/utils/map-styles";
import BaseStats from "../components/BaseStats";
import ChangePokemon from "../components/ChangePokemon";
import TypeBadge from "../../../shared/components/TypeBadge";
import useMetaTags from "../../../app/seo/hooks/useMetaTags";
import GoBack from "../../../shared/components/icons/GoBack";
import Pokedex from "../../../shared/components/icons/Pokedex";
import Weight from "../../../shared/components/icons/Weight";
import Rule from "../../../shared/components/icons/Rule";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  getAbsoluteUrl,
} from "../../../app/seo/helpers/seo";
import { useEffect } from "react";
import useUiStore from "../../../app/store/ui-store";

function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useUiStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Pokemon id missing");
      }
      return getPokemonById(id);
    },
    enabled: Boolean(id),
  });

  const primaryType = data?.types?.[0]?.type?.name?.toLowerCase() ?? "normal";
  const formattedPrimaryType =
    primaryType.charAt(0).toUpperCase() + primaryType.slice(1);
  const bgColor =
    TYPE_BG_CLASS_MAP[primaryType as keyof typeof TYPE_BG_CLASS_MAP] ??
    TYPE_BG_CLASS_MAP.normal;
  const textColor =
    TYPE_TEXT_COLOR_CLASS_MAP[
      primaryType as keyof typeof TYPE_TEXT_COLOR_CLASS_MAP
    ] ?? TYPE_TEXT_COLOR_CLASS_MAP.normal;
  const bgOpacity =
    TYPE_BG_OPACITY_MAP[primaryType as keyof typeof TYPE_BG_OPACITY_MAP] ??
    TYPE_BG_OPACITY_MAP.normal;

  const formattedName = data?.name
    ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
    : "Loading...";
  const heightText = data?.height ? `${data.height} m` : "an unknown height";
  const weightText = data?.weight ? `${data.weight} kg` : "an unknown weight";
  const canonicalFromId = id
    ? getAbsoluteUrl(PATHS.POKEMON_DETAIL(id))
    : getAbsoluteUrl(PATHS.HOME);

  const metaDescription = data
    ? `${formattedName} is a ${formattedPrimaryType}-type Pokémon with ${heightText} and ${weightText}. Review base stats, featured moves, and typing insights.`
    : "Browse detailed Pokémon profiles with types, measurements, moves, and base stats.";

  const statsProperties =
    data?.stats?.map((stat) => ({
      "@type": "PropertyValue",
      name: stat.stat?.name ?? "stat",
      value: stat.base_stat,
    })) ?? [];

  const structuredData = data
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: SITE_NAME,
                item: getAbsoluteUrl(PATHS.HOME),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: formattedName,
                item: canonicalFromId,
              },
            ],
          },
          {
            "@type": "VideoGameCharacter",
            name: formattedName,
            description: metaDescription,
            image: data.image ?? DEFAULT_OG_IMAGE,
            url: canonicalFromId,
            identifier: data.id,
            inLanguage: "en",
            height: data.height ? `${data.height} m` : undefined,
            weight: data.weight ? `${data.weight} kg` : undefined,
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Primary type",
                value: formattedPrimaryType,
              },
              ...statsProperties,
            ],
          },
        ],
      }
    : undefined;

  const handleGoBack = () => {
    const prevPath = localStorage.getItem("prevPath");
    if (prevPath) {
      navigate(prevPath, { replace: true });
      return;
    }
    navigate(PATHS.HOME, { replace: true });
  };

  useMetaTags({
    title: `Pokédex | ${formattedName}`,
    description: metaDescription,
    image: data?.image ?? DEFAULT_OG_IMAGE,
    type: data ? "article" : "website",
    canonical: canonicalFromId,
    structuredData,
  });

  useEffect(() => {
    if (isLoading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isLoading, startLoading, stopLoading]);

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <section className="w-full">
        <div className="rounded-3xl bg-rose-50 p-6 text-rose-600">
          {(error as Error).message || "Unable to load Pokémon details."}
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="w-full">
        <div className="rounded-3xl bg-white/10 p-10 text-center text-slate-200">
          Pokémon not found.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <article
        className={`flex flex-wrap justify-center relative overflow-y-auto min-h-screen ${bgColor}`}
      >
        {/* Go back, Name and ID */}
        <header className="h-fit px-6 pt-6 text-white w-full flex items-center justify-between z-20">
          <div className="flex gap-4 items-center">
            <button
              type="button"
              className="cursor-pointer hover:shadow-lg transition-shadow rounded-full"
              onClick={handleGoBack}
            >
              <GoBack />
            </button>
            <h1 className="text-3xl md:text-5xl font-bold capitalize">
              {data.name}
            </h1>
          </div>
          <p className="text-base md:text-lg font-semibold">
            #{data.id.toString().padStart(3, "0")}
          </p>
        </header>
        {/* Background image */}
        {/* Desktop */}
        <div className="hidden md:block absolute top-0 right-0">
          <Pokedex color="#FFFFFF10" width="600px" height="600px" />
        </div>
        {/* Mobile */}
        <div className="md:hidden absolute top-0 right-0">
          <Pokedex color="#FFFFFF10" width="300px" height="300px" />
        </div>

        {/* Image */}
        <div className="z-10 absolute top-[7%] md:top-[5%] w-[90%] flex flex-wrap justify-center">
          <div className="relative w-full">
            <figure className="flex justify-center">
              <img
                src={data.image}
                alt={data.name}
                className="w-[70%] sm:w-[60%] md:w-fit aspect-square"
              />
            </figure>
            <ChangePokemon />
          </div>
        </div>

        {/* Change Pokemon */}

        {/* Info Cards */}
        <div
          className={`w-full p-2 md:p-8 ${bgColor} text-black self-end mt-[40%] md:mt-[35%] xl:mt-[20%]`}
        >
          <div className="rounded-t-xl p-4 bg-white">
            {/* Type badges */}
            <div className="flex gap-8 w-full justify-center mb-8 mt-20 xl:mt-12">
              {data.types?.map((type) => (
                <TypeBadge key={type.type.name} primaryType={type.type.name} />
              ))}
            </div>
            <h2
              className={`w-full text-center text-xl font-bold ${textColor} mb-4 md:mb-8`}
            >
              About
            </h2>
            <div className="grid grid-cols-3 justify-center">
              <div className="grid gap-2 justify-center border-r border-gray-300">
                <p className="text-base md:text-xl flex items-center gap-2">
                  <Weight />
                  {data.weight} kg
                </p>
                <p className="self-end text-xs md:text-sm text-slate-400 text-center">
                  Weight
                </p>
              </div>
              <div className="grid gap-2 justify-center border-r border-gray-300">
                <p className="text-base md:text-xl flex items-center gap-2">
                  <Rule />
                  {data.height} m
                </p>
                <p className="self-end text-xs md:text-sm text-slate-400 text-center">
                  Height
                </p>
              </div>
              <div className="grid gap-2 justify-center">
                <ul className="capitalize">
                  {data.moves?.slice(0, 2).map((move, idx) => (
                    <li key={idx} className="text-base md:text-xl">
                      {move.move.name}
                    </li>
                  ))}
                </ul>
                <p className="self-end text-xs md:text-sm text-slate-400 text-center">
                  Moves
                </p>
              </div>
            </div>
            <p className="text-justify text-black my-8 md:my-16">
              {metaDescription}
            </p>
            <h2
              className={`w-full text-xl text-center font-bold ${textColor} mb-4 md:mb-8`}
            >
              Base Stats
            </h2>
            <BaseStats
              bgColor={bgColor}
              bgOpacity={bgOpacity}
              stats={data.stats}
              textColor={textColor}
            />
          </div>
        </div>
      </article>
    </section>
  );
}

export default PokemonDetail;
