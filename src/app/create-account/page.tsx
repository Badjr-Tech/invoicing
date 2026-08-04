"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { createAccount, FormState } from "./actions";
import AuthShell, { authButton, authInput } from "@/app/components/AuthShell";

export default function CreateAccountPage() {
  const [state, formAction] = useFormState<FormState, FormData>(
    createAccount,
    undefined,
  );

  return (
    <AuthShell
      title="Start with AGENCY"
      subtitle="Seven days of full access. No card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-sage-700 underline underline-offset-4 hover:text-sage-800"
          >
            Sign in
          </Link>
        </>
      }
    >
      {state?.message ? (
        <div className="rounded-card border border-sage-200 bg-sage-50 p-6">
          <p className="font-semibold text-clay-800">{state.message}</p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500"
          >
            Sign in to get started
          </Link>
        </div>
      ) : (
        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-clay-700">
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={`mt-1.5 ${authInput}`}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-clay-700">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className={`mt-1.5 ${authInput}`}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-clay-700">
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
            <label htmlFor="password" className="block text-sm font-medium text-clay-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              className={`mt-1.5 ${authInput}`}
            />
            <p className="mt-1.5 text-xs text-clay-500">
              At least 12 characters. Length matters more than symbols.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-clay-700"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
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
            Create account
          </button>
        </form>
      )}
    </AuthShell>
  );
}
