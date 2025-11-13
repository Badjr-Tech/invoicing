"use client";

import { useFormState } from "react-dom";
// import { createInvoice } from "./actions";

// export type FormState = {
//   message: string;
//   error: string;
// } | undefined;

export default function InvoicingPage() {
  // const [state, formAction] = useFormState<FormState, FormData>(createInvoice, undefined);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Invoice</h1>
      <form /*action={formAction}*/ className="space-y-6">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
            Client Name
          </label>
          <div className="mt-1">
            <input
              id="clientName"
              name="clientName"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
            Client Email
          </label>
          <div className="mt-1">
            <input
              id="clientEmail"
              name="clientEmail"
              type="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-700">
            Service Description
          </label>
          <div className="mt-1">
            <textarea
              id="serviceDescription"
              name="serviceDescription"
              rows={4}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1">
            <input
              id="amount"
              name="amount"
              type="number"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
        {state?.error && <p className="text-red-600 text-sm">{state.error}</p>} */}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create & Send Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
