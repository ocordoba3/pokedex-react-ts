import { Link, useLocation } from "react-router-dom";

import type { PokemonListItem } from "../interfaces/pokemon.interface";
import { PATHS } from "../utils/paths";

type Props = {
  pokemon: PokemonListItem;
};

export function PokemonCard({ pokemon }: Props) {
  const { pathname, search } = useLocation();
  return (
    <Link
      to={PATHS.POKEMON_DETAIL(pokemon.id.toString())}
      onClick={() => localStorage.setItem("prevPath", pathname + search)}
      className="flex flex-col rounded-2xl bg-white text-slate-800 border border-gray-300 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-end text-base md:text-lg font-normal text-slate-500 py-1 md:py-4 px-4">
        <span>#{pokemon.number.toString().padStart(3, "0")}</span>
      </div>
      <div className="relative md:mt-2 flex flex-col items-center gap-3">
        <div className="absolute bottom-0 flex h-[50%] w-full items-center justify-center rounded-2xl bg-[#efefef]"></div>
        <img
          src={pokemon.image}
          alt={pokemon.name}
          loading="lazy"
          className="w-full object-contain z-10"
        />
        <p className="px-4 mb-2 md:mb-8 font-semibold capitalize text-lg md:text-2xl text-slate-800 line-clamp-1 z-10">
          {pokemon.name}
        </p>
      </div>
    </Link>
  );
}

export default PokemonCard;
