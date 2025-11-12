import type { PokemonStats } from "../interfaces/pokemon.interface";

type Props = {
  bgColor: string;
  bgOpacity: string;
  stats: PokemonStats[];
  textColor: string;
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "SPD",
};

const MAX_BASE_STAT = 255;

const BaseStats = ({ bgColor, stats, textColor, bgOpacity }: Props) => {
  return (
    <div className="">
      {stats.map((item) => {
        const statName = item.stat?.name ?? "";
        const label =
          STAT_LABELS[statName] ?? statName.toUpperCase().slice(0, 4);
        const value = item.base_stat ?? 0;
        const paddedValue = value.toString().padStart(3, "0");
        const percentage = Math.min(
          100,
          Math.round((value / MAX_BASE_STAT) * 100)
        );

        return (
          <div
            key={statName}
            className="flex flex-col gap-2 text-slate-900 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4 sm:w-14 justify-end">
              <span
                className={`font-bold uppercase ${textColor} text-sm tracking-wide`}
              >
                {label}
              </span>
              <span className="hidden h-8 w-px bg-gray-200 sm:block" />
            </div>
            <div className="flex flex-1 items-center gap-4">
              <span className="font-semibold text-slate-700">
                {paddedValue}
              </span>
              <div className={`h-3 flex-1 rounded-full ${bgOpacity}`}>
                <div
                  className={`h-full rounded-full ${bgColor} transition-[width] duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BaseStats;
