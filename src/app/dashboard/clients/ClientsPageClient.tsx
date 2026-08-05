"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createClient } from "./actions";
import EditClientModal from "./EditClientModal";
import { Client, ClientWithBusiness } from "@/db/schema"; // Import Client and ClientWithBusiness types

export type FormState = {
  message: string;
  error: string;
} | undefined;

export default function ClientsPageClient({
  clients,
  businesses,
}: {
  clients: ClientWithBusiness[]; // Use ClientWithBusiness type
  businesses: { id: number; businessName: string }[];
}) {
  const [state, formAction] = useFormState<FormState, FormData>(createClient, undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientWithBusiness | null>(null);
  const [selectedBusinessFilter, setSelectedBusinessFilter] = useState<string>(''); // State for business filter

  const handleEditClick = (client: ClientWithBusiness) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingClient(null);
  };

  // Filtered clients based on selected business
  const filteredClients = clients.filter(client =>
    selectedBusinessFilter === '' || client.businessId?.toString() === selectedBusinessFilter
  );

  return (
    <div className="p-6" suppressHydrationWarning>
      <h1 className="font-display text-3xl font-semibold text-clay-800 mb-6">Clients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-clay-800 mb-4">Add New Client</h2>
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-clay-700">
                Client Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-clay-200 rounded-control shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sage-300 focus:border-sage-400 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-clay-700">
                Client Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-clay-200 rounded-control shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sage-300 focus:border-sage-400 sm:text-sm"
                />
              </div>
            </div>

            {/* Client Business Name */}
            <div>
              <label htmlFor="clientBusinessName" className="block text-sm font-medium text-clay-700">
                Client Business Name (Optional)
              </label>
              <div className="mt-1">
                <input
                  id="clientBusinessName"
                  name="clientBusinessName"
                  type="text"
                  className="appearance-none block w-full px-3 py-2 border border-clay-200 rounded-control shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sage-300 focus:border-sage-400 sm:text-sm"
                />
              </div>
            </div>

            {/* Business Dropdown for Add Client */}
            <div>
              <label htmlFor="businessId" className="block text-sm font-medium text-clay-700">
                Assign to Business (Optional)
              </label>
              <div className="mt-1">
                <select
                  id="businessId"
                  name="businessId"
                  className="appearance-none block w-full px-3 py-2 border border-clay-200 rounded-control shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sage-300 focus:border-sage-400 sm:text-sm"
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

            {state?.message && <p className="text-sage-700 text-sm">{state.message}</p>}
            {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-control shadow-sm text-sm font-medium text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300"
              >
                Add Client
              </button>
            </div>
          </form>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-clay-800 mb-4">Your Clients</h2>
          {/* New: Filter by Business Dropdown */}
          <div className="mb-4">
            <label htmlFor="filterBusiness" className="block text-sm font-medium text-clay-700">
              Filter by Business
            </label>
            <select
              id="filterBusiness"
              name="filterBusiness"
              value={selectedBusinessFilter}
              onChange={(e) => setSelectedBusinessFilter(e.target.value)}
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300 sm:text-sm"
            >
              <option value="">All Businesses</option>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.businessName}
                </option>
              ))}
            </select>
          </div>

          <ul className="space-y-4">
            {filteredClients && filteredClients.map((client) => (
              <li key={client.id} className="p-4 bg-clay-50 rounded-card shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{client.name}</p>
                  <p className="text-sm text-clay-600">Email: {client.email}</p>
                  {client.clientBusinessName && (
                    <p className="text-sm text-clay-500">Client Business: {client.clientBusinessName}</p>
                  )}
                  {client.business && ( // Display associated business
                    <p className="text-sm text-clay-500">Linked Business: {client.business.businessName}</p>
                  )}
                </div>
                <button
                  onClick={() => handleEditClick(client)}
                  className="ml-4 px-3 py-1 border border-transparent rounded-control shadow-sm text-sm font-medium text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {editingClient && (
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          client={editingClient}
          businesses={businesses}
        />
      )}
    </div>
  );
}
