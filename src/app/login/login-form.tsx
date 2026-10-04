"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, { error: null });

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Email</span>
        <input name="email" type="email" autoComplete="email" required className="field" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-chalk-muted">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className="field" />
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? "Signing in…" : "Let me in"}
      </button>
    </form>
  );
}
