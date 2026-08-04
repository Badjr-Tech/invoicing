"use client";

import { useFormState } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { login } from "./actions";

type FormState = {
  error: string;
} | undefined;

const inputStyles =
  "block w-full rounded-control border border-clay-200 bg-white px-3.5 py-2.5 text-clay-800 shadow-sm transition placeholder:text-clay-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200";

export default function LoginPage() {
  const [state, formAction] = useFormState<FormState, FormData>(login, undefined);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-clay-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/agency-logo.svg"
            alt="AGENCY"
            width={72}
            height={72}
            className="mx-auto h-18 w-18 object-contain"
            priority
          />
          <h1 className="mt-6 font-display text-3xl font-semibold text-clay-800">
            Welcome back
          </h1>
          <p className="mt-2 text-clay-600">
            Your business, your books, your clients — all in one place.
          </p>
        </div>

        <div className="rounded-card border border-clay-200 bg-white p-8 shadow-card">
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
                className={`mt-1.5 ${inputStyles}`}
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
                  className="text-xs font-medium text-sage-600 hover:text-sage-700"
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
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-clay-600">
          New here?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-sage-600 underline underline-offset-4 hover:text-sage-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
