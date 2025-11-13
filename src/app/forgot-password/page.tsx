"use client";

import { useFormState } from "react-dom";
import { forgotPassword } from "./actions";
import Link from "next/link";

type FormState = {
  message: string;
  error: string;
} | undefined;

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState<FormState, FormData>(forgotPassword, undefined);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-foreground text-center mb-8">Forgot Password</h1>
        <p className="text-center text-foreground mb-6">
          Enter your email address and we will send you a link to reset your password.
        </p>
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-light-gray rounded-md shadow-sm placeholder-light-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-foreground"
              />
            </div>
          </div>
          {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
          {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login">
            <a className="text-sm text-foreground hover:underline">Back to login</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
