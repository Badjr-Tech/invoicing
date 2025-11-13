"use client";

import { useFormState } from "react-dom";
import { createAccount, FormState } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Added import

export default function CreateAccountPage() {
  const [state, formAction] = useFormState<FormState, FormData>(createAccount, undefined);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative"> {/* Added relative positioning */}
      <Link href="#" onClick={() => router.back()} className="absolute top-4 left-4 text-sm text-foreground hover:underline">
        &larr; Back
      </Link>
      <div className="max-w-md w-full bg-background p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-foreground text-center mb-8">Create an Account</h1>
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                className="appearance-none block w-full px-3 py-2 border border-light-gray rounded-md shadow-sm placeholder-light-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-foreground"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                id="phone"
                name="phone"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-light-gray rounded-md shadow-sm placeholder-light-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-foreground"
              />
            </div>
          </div>
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
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-3 py-2 border border-light-gray rounded-md shadow-sm placeholder-light-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-foreground"
              />
            </div>
          </div>
          {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
          {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
