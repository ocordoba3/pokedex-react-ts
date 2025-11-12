import type { SortOption } from "./ui.interface";

export type PokemonListItem = {
  id: number;
  name: string;
  image: string;
  number: number;
};

export type PokemonListResponse = {
  data: PokemonListItem[];
  page: number;
  totalPages: number;
  total: number;
};

export type PokemonDetail = PokemonListItem & {
  description?: string;
  height?: number;
  weight?: number;
  types?: TypesObj[];
  abilities?: string[];
  moves?: string[];
  forms?: string[];
};

export type PokemonListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: SortOption;
};

type TypesObj = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};
