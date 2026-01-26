import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Pokedex from "../../../../shared/components/icons/Pokedex";
import TypeBadge from "../../../../shared/components/TypeBadge";
import BaseStats from "./BaseStats";
import ChangePokemon from "./ChangePokemon";
import {
  getBackgroundColor,
  getBackgroundOpacity,
  getTextColor,
} from "../../helpers/getStyles";
import type { PokemonDetail } from "../../interfaces/pokemon.interface";
import { detailMetaTag } from "../../helpers/generateMetaTag";
import useMetaTags from "../../../../app/seo/hooks/useMetaTags";
import { DEFAULT_OG_IMAGE } from "../../../../app/seo/helpers/seo";
import About from "./About";
import Header from "./Header";

const DetailContainer = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<PokemonDetail>(["pokemon", id]);
  const {
    name,
    id: pokemonId,
    image,
    types,
    weight,
    height,
    moves,
    stats,
  } = data!; // data is guaranteed to be defined when DetailContainer is rendered

  const primaryType = data?.types?.[0]?.type?.name?.toLowerCase() ?? "normal";
  const bgColor = getBackgroundColor(primaryType);
  const textColor = getTextColor(primaryType);
  const bgOpacity = getBackgroundOpacity(primaryType);

  const { formattedName, metaDescription, canonicalFromId, structuredData } =
    detailMetaTag({
      data,
      id: id ? parseInt(id, 10) : null,
      pokemonType: primaryType,
    });

  useMetaTags({
    title: `Pokédex | ${formattedName}`,
    description: metaDescription,
    image: data?.image ?? DEFAULT_OG_IMAGE,
    type: data ? "article" : "website",
    canonical: canonicalFromId,
    structuredData,
  });

  return (
    <main className="w-full">
      <section
        className={`flex flex-wrap justify-center relative overflow-y-auto min-h-screen ${bgColor}`}
      >
        {/* Go back, Name and ID */}
        <Header name={name} pokemonId={pokemonId} />

        {/* ============ Background image  ============*/}
        {/* Desktop */}
        <div className="hidden md:block absolute top-0 right-0">
          <Pokedex color="#FFFFFF10" width="600px" height="600px" />
        </div>
        {/* Mobile */}
        <div className="md:hidden absolute top-0 right-0">
          <Pokedex color="#FFFFFF10" width="300px" height="300px" />
        </div>
        {/* ============ End of Background image  ============*/}

        {/* Image */}
        <div className="z-10 absolute top-[7%] md:top-[5%] w-[90%] flex flex-wrap justify-center">
          <div className="relative w-full">
            <figure className="flex justify-center">
              <img
                src={image}
                alt={name}
                className="w-[70%] sm:w-[60%] md:w-fit aspect-square"
              />
            </figure>
            <ChangePokemon />
          </div>
        </div>

        {/* Info Cards */}
        <div
          className={`w-full p-2 md:p-8 ${bgColor} text-black self-end mt-[40%] md:mt-[35%] xl:mt-[20%]`}
        >
          <div className="rounded-t-xl p-4 bg-white">
            {/* Type badges */}
            <div className="flex gap-8 w-full justify-center mb-8 mt-20 xl:mt-12">
              {types?.map((type) => (
                <TypeBadge key={type.type.name} primaryType={type.type.name} />
              ))}
            </div>

            <About
              weight={weight}
              height={height}
              moves={moves || []}
              textColor={textColor}
            />

            <p className="text-justify text-black my-8 md:my-16">
              {metaDescription}
            </p>

            <BaseStats
              bgColor={bgColor}
              bgOpacity={bgOpacity}
              stats={stats}
              textColor={textColor}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default DetailContainer;
