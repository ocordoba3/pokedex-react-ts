import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";
import { setAuthToken } from "../../../lib/api";

vi.mock("../../../lib/api", () => ({
  setAuthToken: vi.fn(),
}));

const setAuthTokenMock = vi.mocked(setAuthToken);

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("throws when useAuth is used outside of the provider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth debe usarse dentro de un AuthProvider."
    );
  });

  it("restores persisted session state on mount", () => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("pokedexUser", "misty");

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBe("misty");
  });

  it("logs users in and updates localStorage", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login("ash", "pikachu");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBe("ash");
    expect(localStorage.getItem("isAuthenticated")).toBe("true");
    expect(localStorage.getItem("pokedexUser")).toBe("ash");
  });

  it("logs out and clears session data", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login("brock", "onix");
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("isAuthenticated")).toBeNull();
    expect(localStorage.getItem("pokedexUser")).toBeNull();
    expect(setAuthTokenMock).toHaveBeenCalledWith(null);
  });
});
