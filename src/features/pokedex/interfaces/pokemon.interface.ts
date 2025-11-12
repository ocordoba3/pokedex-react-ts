import type { SortOption } from "./list.interface";

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
  moves?: Moves[];
  forms?: string[];
  stats: PokemonStats[];
};

export type PokemonListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: SortOption;
};

type TypesObj = {
  slot: number;
  type: CommonObj;
};

type Moves = {
  move: CommonObj;
};

type CommonObj = {
  name: string;
  url: string;
};

export interface PokemonStats {
  base_stat: number;
  effort: number;
  stat: Stat;
}

export interface Stat {
  name: string;
  url: string;
}
