"use client";

import { updateService } from "@/app/dashboard/services/actions";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { services as servicesSchema } from "@/db/schema";

type Service = InferSelectModel<typeof servicesSchema>;

export type FormState = {
  message: string;
  error: string;
} | undefined;

export default function EditServiceModal({ service, onClose, onSubmissionSuccess, businesses }: { service: Service, onClose: () => void, onSubmissionSuccess?: () => void, businesses: { id: number; businessName: string }[] }) {
  const [state, formAction] = useFormState<FormState, FormData>(updateService.bind(null, service.id), { message: "", error: "" });

  useEffect(() => {
    if (state?.message && onSubmissionSuccess) {
      onSubmissionSuccess();
      onClose();
    }
  }, [state, onSubmissionSuccess, onClose]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Service</h3>
          <div className="mt-2 px-7 py-3">
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="serviceId" value={service.id} />
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
                    defaultValue={service.name}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="businessId" className="block text-sm font-medium text-gray-700">
                  Business
                </label>
                <div className="mt-1">
                  <select
                    id="businessId"
                    name="businessId"
                    defaultValue={service.businessId || ""}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a business</option>
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.businessName}
                      </option>
                    ))}
                  </select>
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
                    defaultValue={service.description || ""}
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
                    defaultValue={parseFloat(service.price)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
              {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
              <div className="items-center gap-2 mt-3 sm:flex">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
