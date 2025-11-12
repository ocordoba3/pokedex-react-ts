import { Link } from "react-router-dom";
import Router from "./router";
import { useAuth } from "./hooks/useAuth";
import Pokedex from "./assets/icons/pokedex";
import { PATHS } from "./utils/paths";

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="flex flex-nowrap justify-between items-center bg-type-fighting text-white px-4 py-2 md:px-8 md:py-4 sticky top-0 z-10">
        <Link
          to={PATHS.HOME}
          className="text-3xl font-bold tracking-tight flex items-center gap-2"
        >
          <Pokedex color="#FFFFFF" /> Pokédex
        </Link>
        {isAuthenticated && (
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="text-white">
              Trainer:{" "}
              <span className="font-bold text-lg capitalize">
                {user ?? "guest"}
              </span>
            </span>
            <button
              type="button"
              className="rounded-lg border border-white px-3 py-1 text-white transition hover:bg-type-fire/90 cursor-pointer"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8 h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] overflow-y-auto [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar]:w-1.5">
        <Router />
      </main>
    </div>
  );
}

export default App;
