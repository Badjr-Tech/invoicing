"use client";

import { useFormState } from "react-dom";
import { populateLocations } from "./actions";

export type FormState = {
  message: string;
  error: string;
} | undefined;

export default function PopulateLocationsPage() {
  const [state, formAction] = useFormState<FormState, FormData>(populateLocations, undefined);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Populate Locations</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to populate the database with initial location data (Cities, Regions).
          This action will only run if the locations table is currently empty.
        </p>
        <form action={formAction}>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Populate Locations
          </button>
        </form>
        {state?.message && <p className="mt-4 text-green-600 text-sm">{state.message}</p>}
        {state?.error && <p className="mt-4 text-red-600 text-sm">{state.error}</p>}
      </div>
    </div>
  );
}
