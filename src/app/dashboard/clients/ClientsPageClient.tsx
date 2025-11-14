"use client";

import { useFormState } from "react-dom";
import { createClient } from "./actions";

export type FormState = {
  message: string;
  error: string;
} | undefined;

export default function ClientsPageClient({
  clients,
}: {
  clients: { id: number; name: string; email: string }[];
}) {
  const [state, formAction] = useFormState<FormState, FormData>(createClient, undefined);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Clients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Client</h2>
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Client Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
            {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Client
              </button>
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Clients</h2>
          <ul className="space-y-4">
            {clients && clients.map((client) => (
              <li key={client.id} className="p-4 bg-gray-50 rounded-lg shadow">
                <p className="font-semibold">{client.name}</p>
                <p className="text-sm text-gray-600">{client.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
