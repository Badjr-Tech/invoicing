"use client";

import { createServiceCategory } from "./categories/actions";
import { useFormState } from "react-dom";
// import { FormState } from "./page"; // Removed import

export type FormState = { // Added type definition
  message: string;
  error: string;
} | undefined;

export default function ServiceCategoryForm() {
  const [state, formAction] = useFormState<FormState, FormData>(createServiceCategory, { message: "", error: "" });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Category</h2>
      <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Category Name
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
            Description (Optional)
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

        {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
        {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
}
