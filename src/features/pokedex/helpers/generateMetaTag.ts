import { PATHS } from "../../../app/router/utils/paths";
import {
  DEFAULT_OG_IMAGE,
  getAbsoluteUrl,
  SITE_NAME,
} from "../../../app/seo/helpers/seo";
import type { PokemonDetail } from "../interfaces/pokemon.interface";

type MetaTagDetailParams = {
  data: PokemonDetail | undefined;
  id: number | null;
  pokemonType: string;
};

export const detailMetaTag = ({
  data,
  id,
  pokemonType,
}: MetaTagDetailParams) => {
  const formattedPrimaryType =
    pokemonType.charAt(0).toUpperCase() + pokemonType.slice(1);
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

  return {
    formattedName,
    metaDescription,
    canonicalFromId,
    structuredData,
  };
};
