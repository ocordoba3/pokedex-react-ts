import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";

import { PATHS } from "../utils/paths";
import { useAuth } from "../hooks/useAuth";
import { useLoginMutation } from "../helpers/auth";
import useMetaTags from "../hooks/useMetaTags";
import type { ErrorResp } from "../interfaces/auth.interface";

function Login() {
  const { isAuthenticated, login } = useAuth();
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useMetaTags({
    title: "Pokédex | Login",
    description: "Sign in to your Pokédex account.",
  });

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const username = formData.username.trim();
    const password = formData.password.trim();

    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      await loginMutation.mutateAsync({
        username,
        password,
      });
      await login(username, password);
      navigate(PATHS.HOME, { replace: true });
    } catch (error) {
      const message =
        (error as ErrorResp)?.response?.data?.message ??
        "Unexpected error. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="flex h-[calc(100vh-72px)] items-center justify-center mx-auto max-w-5xl px-4">
      <div className="w-full max-w-md rounded-2xl md:border md:border-slate-800 bg-white p-8 md:shadow-xl shadow-black/40">
        <header className="space-y-1 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Sign in to your Pokédex
          </h1>
          <p className="text-sm text-slate-400">
            Enter your credentials to continue.
          </p>
        </header>

        {errorMessage ? (
          <p className="mt-6 rounded-lg bg-type-fairy px-4 py-3 text-sm font-medium text-white">
            {errorMessage}
          </p>
        ) : null}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-1 text-sm">
            <span className="text-slate-500">Username</span>
            <input
              autoComplete="off"
              className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-slate-900 outline-none transition focus:border-type-fighting"
              onChange={(event) => handleChange("username", event.target.value)}
              placeholder="ash.ketchum"
              required
              value={formData.username}
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="text-slate-500">Password</span>
            <input
              autoComplete="off"
              className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-slate-900 outline-none transition focus:border-type-fighting"
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={formData.password}
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-type-fighting px-4 py-2.5 font-semibold text-white transition hover:bg-type-fighting/90 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
