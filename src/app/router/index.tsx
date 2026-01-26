import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { PATHS } from "./utils/paths";
import ProtectedRoute from "../../features/auth/components/ProtectedRoute";

const Login = lazy(() => import("../../features/auth/pages/Login"));
const PokemonListPage = lazy(
  () => import("../../features/pokedex/pages/PokemonListPage"),
);
const PokemonDetailPage = lazy(
  () => import("../../features/pokedex/pages/PokemonDetailPage"),
);

function Router() {
  return (
    <Routes>
      <Route path={PATHS.LOGIN} element={<Login />} />
      <Route
        path={PATHS.HOME}
        children={[
          <Route
            path={PATHS.HOME}
            element={
              <ProtectedRoute>
                <PokemonListPage />
              </ProtectedRoute>
            }
          />,
          <Route
            path={PATHS.POKEMON_DETAIL(":id")}
            element={
              <ProtectedRoute>
                <PokemonDetailPage />
              </ProtectedRoute>
            }
          />,
        ]}
      />
      <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
    </Routes>
  );
}

export default Router;
