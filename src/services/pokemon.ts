import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "./api";

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
  types?: string[];
  abilities?: string[];
  moves?: string[];
  forms?: string[];
};

export type PokemonListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "name" | "number";
};

export async function getPokemons(
  params: PokemonListParams = {}
): Promise<PokemonListResponse> {
  const { data } = await api.get<PokemonListResponse>("/pokemons", {
    params,
  });

  return data;
}

export async function getPokemonById(
  id: string | number
): Promise<PokemonDetail> {
  const { data } = await api.get<PokemonDetail>(`/pokemons/${id}`);
  return data;
}

export function usePokemons(params: PokemonListParams = {}) {
  return useQuery({
    queryKey: ["pokemons", params],
    queryFn: () => getPokemons(params),
    placeholderData: keepPreviousData,
  });
}

export function usePokemon(id?: string | number) {
  return useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Pokemon id is required");
      }

      return getPokemonById(id);
    },
    enabled: Boolean(id),
  });
}
