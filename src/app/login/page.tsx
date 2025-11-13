"use client";

import { useFormState } from "react-dom";
import { login } from "./actions";
import { useRouter } from "next/navigation"; // Added import
import Link from "next/link"; // Added import

type FormState = {
  error: string;
} | undefined;

export default function LoginPage() {
  const [state, formAction] = useFormState<FormState, FormData>(login, undefined);
  const router = useRouter(); // Initialize useRouter

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative"> {/* Added relative positioning */}
      <Link href="#" onClick={() => router.back()} className="absolute top-4 left-4 text-sm text-foreground hover:underline">
        &larr; Back
      </Link>
      <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-foreground text-center mb-8">Login</h1>
        <p className="text-center text-foreground mb-6">
          Enter your credentials to access your account.
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-light-gray rounded-md shadow-sm placeholder-light-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-foreground"
              />
            </div>
          </div>
          {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <Link href="/forgot-password">
            <a className="text-sm text-foreground hover:underline">Forgot Password?</a>
          </Link>
        </div>
        <div className="mt-2 text-center">
          <Link href="/create-account">
            <a className="text-sm text-foreground hover:underline">Create an account</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
