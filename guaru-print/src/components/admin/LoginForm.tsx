"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="label">
          Senha
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm text-magenta">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="min-h-12 w-full rounded-full bg-paper font-sub font-semibold text-ink disabled:opacity-60">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
