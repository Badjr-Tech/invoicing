"use client";

import { useFormState } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { createAccount, FormState } from "./actions";

const inputStyles =
  "block w-full rounded-control border border-clay-200 bg-white px-3.5 py-2.5 text-clay-800 shadow-sm transition placeholder:text-clay-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200";

export default function CreateAccountPage() {
  const [state, formAction] = useFormState<FormState, FormData>(
    createAccount,
    undefined,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-clay-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/yellow.png"
            alt="AGENCY"
            width={72}
            height={72}
            className="mx-auto h-18 w-18 object-contain"
            priority
          />
          <h1 className="mt-6 font-display text-3xl font-semibold text-clay-800">
            Start with AGENCY
          </h1>
          <p className="mt-2 text-clay-600">
            Seven days of full access. No card required.
          </p>
        </div>

        <div className="rounded-card border border-clay-200 bg-white p-8 shadow-card">
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
                className={`mt-1.5 ${inputStyles}`}
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
                className={`mt-1.5 ${inputStyles}`}
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
                className={`mt-1.5 ${inputStyles}`}
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
                className={`mt-1.5 ${inputStyles}`}
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
            {state?.message && (
              <div className="rounded-control border border-sage-200 bg-sage-50 px-3.5 py-2.5 text-sm text-clay-800">
                <p className="font-semibold">{state.message}</p>
                <Link
                  href="/login"
                  className="mt-1 inline-block font-medium text-sage-700 underline underline-offset-4"
                >
                  Sign in to get started
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-control bg-ember-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500"
            >
              Create account
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-clay-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-sage-600 underline underline-offset-4 hover:text-sage-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
