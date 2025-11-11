import { Link } from "react-router-dom";
import type { PokemonListItem } from "../services/pokemon";

type PokemonCardProps = {
  pokemon: PokemonListItem;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="flex flex-col rounded-2xl bg-white p-3 text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(225,29,72,0.25)]"
    >
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span>#{pokemon.number.toString().padStart(3, "0")}</span>
        <span className="text-rose-500">→</span>
      </div>
      <div className="mt-2 flex flex-col items-center gap-3">
        <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-slate-100">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            loading="lazy"
            className="h-24 w-24 object-contain"
          />
        </div>
        <p className="text-base font-semibold capitalize text-slate-800">
          {pokemon.name}
        </p>
      </div>
    </Link>
  );
}

export default PokemonCard;
