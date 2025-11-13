"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createInvoice } from "./actions";
import { generateInvoicePDF } from "./pdf";

export type FormState = {
  message: string;
  error: string;
  invoice?: {
    client: { name: string; email: string };
    services: { name: string; price: string }[];
    totalAmount: number;
    user: { logoUrl: string | null };
  };
} | undefined;

export default function InvoicingPageClient({
  clients,
  services,
}: {
  clients: { id: number; name: string; email: string }[];
  services: { id: number; name: string; description: string | null; price: string }[];
}) {
  const [state, formAction] = useFormState<FormState, FormData>(createInvoice, undefined);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);

  useEffect(() => {
    if (state?.message && state.invoice) {
      generateInvoicePDF(
        state.invoice.client,
        state.invoice.services,
        state.invoice.totalAmount,
        state.invoice.user.logoUrl
      );
      const mailtoLink = `mailto:${state.invoice.client.email}?subject=Invoice&body=Please find your invoice attached.`;
      window.location.href = mailtoLink;
    }
  }, [state]);

  const handleAddService = (service: any) => {
    setSelectedServices([...selectedServices, service]);
  };

  const totalAmount = selectedServices.reduce((acc, service) => acc + parseFloat(service.price), 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Invoice</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Add Services */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Services</h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="p-4 bg-gray-50 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <p className="text-sm font-bold">${service.price}</p>
                </div>
                <button
                  onClick={() => handleAddService(service)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Invoice Cart */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoice</h2>
          <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                Client
              </label>
              <div className="mt-1">
                <select
                  id="clientId"
                  name="clientId"
                  required
                  onChange={(e) => setSelectedClient(parseInt(e.target.value))}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-800">Selected Services</h3>
              {selectedServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p>{service.name}</p>
                  <p>${service.price}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <input type="hidden" name="services" value={JSON.stringify(selectedServices)} />
            <input type="hidden" name="totalAmount" value={totalAmount} />


            {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
            {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

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
      </div>
    </div>
  );
}
