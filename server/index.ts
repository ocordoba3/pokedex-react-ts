import "dotenv/config";
import axios, { AxiosError } from "axios";
import cors from "cors";
import express, { Request, Response } from "express";

const PORT = process.env.VITE_PORT ?? 3000;
const ALLOWED_ORIGIN = process.env.VITE_ALLOWED_ORIGIN;
const POKE_API_BASE = process.env.VITE_POKE_API_BASE;
const LIST_LIMIT = 2000; // enough to cover current Pokédex entries

type PokemonListEntry = {
  id: number;
  name: string;
  number: number;
  image: string;
};

let cachedPokemonList: PokemonListEntry[] | null = null;

const app = express();

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
);
app.use(express.json());

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (username === "admin" && password === "admin") {
    return res.json({ token: "mock-token" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

async function ensurePokemonList(): Promise<PokemonListEntry[]> {
  if (cachedPokemonList) {
    return cachedPokemonList;
  }

  const response = await axios.get<{
    results: Array<{ name: string; url: string }>;
  }>(`${POKE_API_BASE}/pokemon`, {
    params: { limit: LIST_LIMIT },
  });

  cachedPokemonList = response.data.results.map((item) => {
    const idMatch = item.url.match(/\/pokemon\/(\d+)\//);
    const id = idMatch ? Number(idMatch[1]) : 0;
    return {
      id,
      name: item.name,
      number: id,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });

  return cachedPokemonList;
}

app.get("/pokemons", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    const search =
      (req.query.search as string | undefined)?.toLowerCase() ?? "";
    const sortParam = req.query.sort === "name" ? "name" : "number";

    const list = await ensurePokemonList();
    let filtered = list;

    if (search) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortParam === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.number - b.number;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return res.json({
      data,
      page: safePage,
      totalPages,
      total,
    });
  } catch (error) {
    console.error("Error fetching pokemons", error);
    return res.status(500).json({ message: "Failed to load pokemons" });
  }
});

app.get("/pokemons/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axios.get(`${POKE_API_BASE}/pokemon/${id}`);
    const image =
      data.sprites?.other?.["official-artwork"]?.front_default ??
      data.sprites?.front_default ??
      null;

    return res.json({ ...data, image });
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status ?? 500;
    return res
      .status(status)
      .json({ message: "Failed to load pokemon detail", status });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server ready at http://localhost:${PORT}`);
});
