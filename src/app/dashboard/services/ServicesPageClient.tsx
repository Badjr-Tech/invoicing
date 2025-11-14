"use client";

import { useFormState } from "react-dom";
import { createService } from "./actions";

export type FormState = {
  message: string;
  error: string;
} | undefined;

export default function ServicesPageClient({
  services,
}: {
  services: { id: number; name: string; description: string | null; price: string }[];
}) {
  const [state, formAction] = useFormState<FormState, FormData>(createService, undefined);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Service</h2>
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Service Name
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1">
                <input
                  id="price"
                  name="price"
                  type="number"
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
                Add Service
              </button>
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Services</h2>
          <ul className="space-y-4">
            {services && services.map((service) => (
              <li key={service.id} className="p-4 bg-gray-50 rounded-lg shadow">
                <p className="font-semibold">{service.name}</p>
                <p className="text-sm text-gray-600">{service.description}</p>
                <p className="text-sm font-bold">${service.price}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
