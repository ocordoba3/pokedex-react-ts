import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { PATHS } from "./utils/paths";
import ProtectedRoute from "../../features/auth/components/ProtectedRoute";

const Home = lazy(() => import("../../features/pokedex/pages/Home"));
const Login = lazy(() => import("../../features/auth/pages/Login"));
const PokemonDetail = lazy(
  () => import("../../features/pokedex/pages/PokemonDetail")
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
                <Home />
              </ProtectedRoute>
            }
          />,
          <Route
            path={PATHS.POKEMON_DETAIL(":id")}
            element={
              <ProtectedRoute>
                <PokemonDetail />
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
