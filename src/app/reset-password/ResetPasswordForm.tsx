"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { resetPassword, FormState } from "./actions";

const inputStyles =
  "block w-full rounded-control border border-clay-200 bg-white px-3.5 py-2.5 text-clay-800 shadow-sm transition placeholder:text-clay-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useFormState<FormState, FormData>(
    resetPassword,
    undefined,
  );

  if (state?.message) {
    return (
      <div className="rounded-card border border-sage-200 bg-sage-50 p-6 text-center">
        <p className="font-semibold text-clay-800">{state.message}</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-clay-700">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          className={`mt-1.5 ${inputStyles}`}
        />
        <p className="mt-1.5 text-xs text-clay-500">At least 12 characters.</p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-clay-700"
        >
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className={`mt-1.5 ${inputStyles}`}
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

      <button
        type="submit"
        className="w-full rounded-control bg-ember-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500"
      >
        Set new password
      </button>
    </form>
  );
}
