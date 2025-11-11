import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { setAuthToken } from "../services/api";

type AuthContextValue = {
  user: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEYS = {
  auth: "isAuthenticated",
  user: "pokedexUser",
};

const getStoredSession = () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null as string | null };
  }

  return {
    isAuthenticated: window.localStorage.getItem(STORAGE_KEYS.auth) === "true",
    user: window.localStorage.getItem(STORAGE_KEYS.user),
  };
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const storedSession = getStoredSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    storedSession.isAuthenticated
  );
  const [user, setUser] = useState<string | null>(storedSession.user);

  const login = useCallback(async (username: string, password: string) => {
    if (!username || !password) {
      throw new Error("Username and password are required.");
    }

    window.localStorage.setItem(STORAGE_KEYS.auth, "true");
    window.localStorage.setItem(STORAGE_KEYS.user, username);
    setUser(username);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEYS.auth);
    window.localStorage.removeItem(STORAGE_KEYS.user);
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [user, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
