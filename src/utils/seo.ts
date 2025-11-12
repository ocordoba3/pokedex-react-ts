const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://pokedex.local";

export const SITE_NAME = "Pokédex App";
export const SITE_DESCRIPTION =
  "Explore the online Pokédex to search, filter, and learn detailed stats for every Pokémon.";
export const DEFAULT_OG_IMAGE =
  (import.meta.env.VITE_DEFAULT_OG_IMAGE as string | undefined) ??
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png";

export const getAbsoluteUrl = (path = "") => {
  if (!path) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export { SITE_URL };
