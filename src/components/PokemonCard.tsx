import { Link } from "react-router-dom";

import type { PokemonListItem } from "../interfaces/pokemon.interface";
import { PATHS } from "../utils/paths";

type Props = {
  pokemon: PokemonListItem;
};

export function PokemonCard({ pokemon }: Props) {
  return (
    <Link
      to={PATHS.POKEMON_DETAIL(pokemon.id.toString())}
      className="flex flex-col rounded-2xl bg-white text-slate-800 shadow-[0_6px_8px_rgba(15,23,42,0.15)] transition hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(15,23,42,0.2)]"
    >
      <div className="flex items-center justify-end text-lg font-normal text-slate-500 p-4">
        <span>#{pokemon.number.toString().padStart(3, "0")}</span>
      </div>
      <div className="relative mt-2 flex flex-col items-center gap-3">
        <div className="absolute bottom-0 flex h-[50%] w-full items-center justify-center rounded-2xl bg-[#efefef]"></div>
        <img
          src={pokemon.image}
          alt={pokemon.name}
          loading="lazy"
          className="w-full object-contain z-10"
        />
        <p className="pb-8 font-semibold capitalize text-3xl text-slate-800 z-10">
          {pokemon.name}
        </p>
      </div>
    </Link>
  );
}

export default PokemonCard;
