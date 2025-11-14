"use client";

import { getServiceCategories } from "../categories/actions";
import { getServices, createService } from "../actions";
import { useFormState } from "react-dom";
import { notFound } from "next/navigation";
import Link from "next/link";

export type FormState = {
  message: string;
  error: string;
} | undefined;

export default async function CategoryServicesPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const categoryId = parseInt(params.categoryId);

  if (isNaN(categoryId)) {
    notFound();
  }

  const categories = await getServiceCategories();
  const currentCategory = categories.find((cat) => cat.id === categoryId);

  if (!currentCategory) {
    notFound();
  }

  const services = await getServices(categoryId);
  const [state, formAction] = useFormState<FormState, FormData>(createService, undefined);

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Services in {currentCategory.name}
        </h1>
        <Link href="/dashboard/services" className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Back to Categories
        </Link>
      </div>
      {currentCategory.description && (
        <p className="text-gray-600 mb-6">{currentCategory.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Add New Service */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Service</h2>
          <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <input type="hidden" name="categoryId" value={categoryId} />
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

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="mt-1">
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
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

        {/* Right Column: Services in this Category */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Services</h2>
          <ul className="space-y-4">
            {services.length === 0 ? (
              <p>No services found in this category. Add one using the form!</p>
            ) : (
              services.map((service) => (
                <li key={service.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{service.name}</p>
                    {service.description && <p className="text-sm text-gray-600">{service.description}</p>}
                    <p className="text-sm font-bold">${parseFloat(service.price).toFixed(2)}</p>
                  </div>
                  {/* Add edit/delete buttons here later */}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
