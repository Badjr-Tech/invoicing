"use client";

import { useFormState } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { forgotPassword } from "./actions";

type FormState = {
  message: string;
  error: string;
} | undefined;

const inputStyles =
  "block w-full rounded-control border border-clay-200 bg-white px-3.5 py-2.5 text-clay-800 shadow-sm transition placeholder:text-clay-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200";

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState<FormState, FormData>(
    forgotPassword,
    undefined,
  );

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
            Reset your password
          </h1>
          <p className="mt-2 text-clay-600">
            Enter your email and we&apos;ll send you a link.
          </p>
        </div>

        <div className="rounded-card border border-clay-200 bg-white p-8 shadow-card">
          {state?.message ? (
            <p className="rounded-control border border-sage-200 bg-sage-50 px-3.5 py-3 text-sm text-clay-800">
              {state.message}
            </p>
          ) : (
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
                Send reset link
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-clay-600">
          <Link
            href="/login"
            className="font-semibold text-sage-600 underline underline-offset-4 hover:text-sage-700"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
