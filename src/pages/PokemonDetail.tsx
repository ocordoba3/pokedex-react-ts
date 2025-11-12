import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getPokemonById } from "../helpers/pokemon";
import { PATHS } from "../utils/paths";
import {
  TYPE_BG_CLASS_MAP,
  TYPE_BG_OPACITY_MAP,
  TYPE_TEXT_COLOR_CLASS_MAP,
} from "../utils/map-styles";
import GoBack from "../assets/icons/GoBack";
import Pokedex from "../assets/icons/Pokedex";
import useMetaTags from "../hooks/useMetaTags";
import TypeBadge from "../components/TypeBadge";
import BaseStats from "../components/BaseStats";
import ChangePokemon from "../components/ChangePokemon";
import Weight from "../assets/icons/Weight";
import Rule from "../assets/icons/Rule";

function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  useMetaTags({
    title: `Pokédex | ${
      data?.name
        ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
        : "Pokemon Detail"
    }`,
    description: `Details and information about ${
      data?.name ?? "this Pokémon"
    }.`,
  });

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="rounded-3xl bg-white/10 p-10 text-center text-slate-200">
          Loading Pokémon data...
        </div>
      </section>
    );
  }

  if (isError && !isLoading) {
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
        className={`flex justify-center relative overflow-y-auto h-screen ${bgColor}`}
      >
        {/* Background image */}
        {/* Desktop */}
        <div className="hidden md:block absolute top-0 right-0">
          <Pokedex color="#FFFFFF10" width="600px" height="600px" />
        </div>
        {/* Mobile */}
        <div className="md:hidden absolute top-0 right-0">
          <Pokedex color="#FFFFFF10" width="300px" height="300px" />
        </div>
        {/* Go back, Name and ID */}
        <header className="absolute top-0 px-6 pt-6 text-white w-full flex items-center justify-between z-20">
          <div className="flex gap-4 items-center">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => navigate(PATHS.HOME, { replace: true })}
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
        {/* Image */}
        <figure className="z-10 absolute top-[5%] md:top-[10%] w-[90%] flex justify-center">
          <img
            src={data.image}
            alt={data.name}
            className="w-[90%] md:w-1/2 object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.35)]"
          />
        </figure>

        {/* Change Pokemon */}
        <ChangePokemon />

        {/* Info Cards */}
        <div
          className={`absolute -bottom-10 md:-bottom-[400px] p-2 md:p-8 ${bgColor} text-slate-700 w-full`}
        >
          <div className="rounded-t-xl p-4 bg-white relative">
            <div className="p-2 md:p-6">
              {/* Type badges */}
              <div className="flex gap-8 w-full justify-center mb-8 mt-20 md:mt-20">
                {data.types?.map((type) => (
                  <TypeBadge
                    key={type.type.name}
                    primaryType={type.type.name}
                  />
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
              {/* Fake description */}
              <p className="text-justify text-black my-8 md:my-16">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex
                debitis culpa reiciendis asperiores alias officiis fugit! Dolor
                alias voluptate laboriosam?
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
        </div>
      </article>
    </section>
  );
}

export default PokemonDetail;
