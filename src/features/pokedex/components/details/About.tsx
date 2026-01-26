import RuleIcon from "../../../../shared/components/icons/Rule";
import WeightIcon from "../../../../shared/components/icons/Weight";
import type { Moves } from "../../interfaces/pokemon.interface";

interface Props {
  weight: number;
  height: number;
  moves: Moves[];
  textColor: string;
}

const About = ({ weight, height, moves, textColor }: Props) => {
  return (
    <>
      <h2
        className={`w-full text-center text-xl font-bold ${textColor} mb-4 md:mb-8`}
      >
        About
      </h2>
      <div className="grid grid-cols-3 justify-center">
        <div className="grid gap-2 justify-center border-r border-gray-300">
          <p className="text-base md:text-xl flex items-center gap-2">
            <WeightIcon />
            {weight} kg
          </p>
          <p className="self-end text-xs md:text-sm text-slate-400 text-center">
            Weight
          </p>
        </div>
        <div className="grid gap-2 justify-center border-r border-gray-300">
          <p className="text-base md:text-xl flex items-center gap-2">
            <RuleIcon />
            {height} m
          </p>
          <p className="self-end text-xs md:text-sm text-slate-400 text-center">
            Height
          </p>
        </div>
        <div className="grid gap-2 justify-center">
          <ul className="capitalize">
            {moves?.slice(0, 2).map((move, idx) => (
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
    </>
  );
};

export default About;
