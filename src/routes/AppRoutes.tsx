import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Home from "./Home";
import PokemonDetail from "./PokemonDetail";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        children={[
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />,
          <Route
            path="/pokemon/:id"
            element={
              <ProtectedRoute>
                <PokemonDetail />
              </ProtectedRoute>
            }
          />,
        ]}
      />
    </Routes>
  );
}

export default AppRoutes;
