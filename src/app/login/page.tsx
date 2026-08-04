"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { login } from "./actions";
import AuthShell, { authButton, authInput } from "@/app/components/AuthShell";

type FormState = {
  error: string;
} | undefined;

export default function LoginPage() {
  const [state, formAction] = useFormState<FormState, FormData>(login, undefined);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-sage-700 underline underline-offset-4 hover:text-sage-800"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-clay-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`mt-1.5 ${authInput}`}
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-clay-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-sage-700 hover:text-sage-800"
            >
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={`mt-1.5 ${authInput}`}
          />
        </div>

        {state?.error && (
          <p
            role="alert"
            className="rounded-control border border-ember-200 bg-ember-50 px-3.5 py-2.5 text-sm text-clay-800"
          >
            {state.error}
          </p>
        )}

        <button type="submit" className={authButton}>
          Sign in
        </button>
      </form>
    </AuthShell>
  );
}
