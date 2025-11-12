# Pokédex

Full-stack web app (React + Vite + Express) that recreates a modern Pokédex. After signing in you can search, filter, and sort Pokémon, review detailed pages (types, base stats, height/weight, official artwork), and hop between entries without losing the session. The backend layer caches PokeAPI listings to speed up navigation and normalizes the responses consumed by the frontend.

## Key features

- Mock authentication: log in with (`admin` / `admin`) to reach the protected list.
- Grid with search, pagination, and sorting by number or name, persisted in the URL.
- Detail page themed by primary type, previous/next navigation, and rich SEO metadata.
- Express backend acting as a proxy/cache for PokeAPI, exposing login, list, and detail endpoints.

## Stack

- React 19 + Vite + TypeScript.
- React Router 7 and React Query 5 for routing and cached fetching.
- Tailwind CSS v4 (via `@tailwindcss/vite`) for utility styling.
- Express + Axios + TSX (TypeScript runtime) to integrate with PokeAPI.

## Prerequisites

- Node.js 20+ and npm 10+.
- Network access to reach the [PokeAPI](https://pokeapi.co/).

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables by renaming the `.env.example` file to `.env` in the project root (the same file is read by both Vite and the backend):

   ```bash
   # Backend
   VITE_PORT=3000
   VITE_ALLOWED_ORIGIN=http://localhost:5173
   VITE_POKE_API_BASE=https://pokeapi.co/api/v2

   # Frontend
   VITE_API_URL=http://localhost:3000
   VITE_SITE_URL=https://pokedex.local
   VITE_DEFAULT_OG_IMAGE=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png
   ```

   - `VITE_ALLOWED_ORIGIN` must match the origin where Vite runs.
   - `VITE_API_URL` must point to the Express backend.
   - `VITE_SITE_URL` and `VITE_DEFAULT_OG_IMAGE` feed SEO/Open Graph data; customize them per environment.

## Run locally

1. **Start the backend first** (required so the frontend can authenticate and query the Pokédex):
   ```bash
   npm run backend
   ```
   This launches the Express server at `http://localhost:${VITE_PORT}` and keeps the terminal busy.
2. In a separate terminal, **start the Vite frontend**:
   ```bash
   npm run dev
   ```
   By default it serves on `http://localhost:5173`.
3. Open the Vite URL in your browser, sign in with `admin` / `admin`, and explore the Pokédex.

## Useful scripts

- **`npm run backend`**: starts the Express server (required for the app to work).
- **`npm run dev`**: launches the Vite dev server for local development.
- **`npm run build`**: compiles TypeScript and produces production assets.
- **`npm run preview`**: serves the pre-built bundle locally.
- **`npm run lint`**: runs ESLint to check code quality.
- **`npm run test`**: executes the project's test suite.

## Notes

- The backend keeps an in-memory cache for the master list; restart the process if you need to flush it.
- If you change the default ports, update both `VITE_ALLOWED_ORIGIN` and `VITE_API_URL` to avoid CORS or auth issues.
