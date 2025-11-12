import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "../pages/Login";
import Home from "../pages/Home";
import PokemonDetail from "../pages/PokemonDetail";
import { PATHS } from "../utils/paths";

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
