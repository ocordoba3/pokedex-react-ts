import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ContextType } from "react";

import ProtectedRoute from "./ProtectedRoute";
import AuthContext from "../context/AuthContext";

type AuthContextShape = NonNullable<ContextType<typeof AuthContext>>;

const createAuthValue = (overrides?: Partial<AuthContextShape>): AuthContextShape => ({
  user: null,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
  ...overrides,
});

const renderWithRouter = (authValue: AuthContextShape) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <p>Private area</p>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<p>Login screen</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe("ProtectedRoute", () => {
  it("redirects to login when the user is not authenticated", () => {
    renderWithRouter(createAuthValue({ isAuthenticated: false }));

    expect(screen.getByText("Login screen")).toBeInTheDocument();
  });

  it("renders children when the user is authenticated", () => {
    renderWithRouter(createAuthValue({ isAuthenticated: true, user: "ash" }));

    expect(screen.getByText("Private area")).toBeInTheDocument();
  });
});
