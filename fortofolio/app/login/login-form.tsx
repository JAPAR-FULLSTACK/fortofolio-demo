"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <div>
        <label
          htmlFor="username"
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.15em] text-ink-soft"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          required
          autoComplete="username"
          placeholder="admin"
          className="w-full rounded-lg border-[1.5px] border-ink bg-paper px-3.5 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_0_var(--ink)]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.15em] text-ink-soft"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border-[1.5px] border-ink bg-paper px-3.5 py-2.5 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_0_var(--ink)]"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border-[1.5px] border-red-700 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="stamp-sm w-full rounded-lg bg-accent py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper-raised transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
