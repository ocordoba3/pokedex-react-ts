import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLoginMutation } from "../services/auth";

type LocationState = {
  from?: Location;
};

function Login() {
  const { isAuthenticated, login } = useAuth();
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const redirectTo = state?.from?.pathname ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      await loginMutation.mutateAsync({
        username: username.trim(),
        password: password.trim(),
      });
      await login(username.trim(), password.trim());
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-white p-8 shadow-xl shadow-black/40">
        <header className="space-y-1 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Sign in to your Pokédex
          </h1>
          <p className="text-sm text-slate-400">
            Enter your credentials to continue.
          </p>
        </header>

        {errorMessage ? (
          <p className="mt-6 rounded-lg bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-100">
            {errorMessage}
          </p>
        ) : null}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block space-y-1 text-sm">
            <span className="text-slate-500">Username</span>
            <input
              className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-slate-900 outline-none transition focus:border-type-fighting"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="ash.ketchum"
              autoComplete="off"
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="text-slate-500">Password</span>
            <input
              className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-slate-900 outline-none transition focus:border-type-fighting"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
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
