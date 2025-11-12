import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { PATHS } from "../utils/paths";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const PokemonDetail = lazy(() => import("../pages/PokemonDetail"));

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
