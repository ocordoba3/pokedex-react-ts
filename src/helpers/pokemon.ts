import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { api } from "./api";
import type {
  PokemonListParams,
  PokemonListResponse,
  PokemonDetail,
} from "../interfaces/pokemon.interface";

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
