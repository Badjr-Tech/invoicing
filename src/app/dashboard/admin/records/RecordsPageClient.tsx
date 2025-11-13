"use client";

import { useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { invoices, businesses, clients, services } from "@/db/schema";

type Invoice = InferSelectModel<typeof invoices>;
type Business = InferSelectModel<typeof businesses>;
type Client = InferSelectModel<typeof clients>;
type Service = InferSelectModel<typeof services>;

export default function RecordsPageClient({
  invoices,
  businesses,
  clients,
  services,
}: {
  invoices: Invoice[];
  businesses: Business[];
  clients: Client[];
  services: Service[];
}) {
  const [activeTab, setActiveTab] = useState('invoices');

  const renderContent = () => {
    switch (activeTab) {
      case 'invoices':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Invoices</h2>
            {invoices.length === 0 ? (
              <p>No invoices found.</p>
            ) : (
              <ul className="space-y-4">
                {invoices.map((invoice) => (
                  <li key={invoice.id} className="p-4 bg-gray-50 rounded-lg shadow">
                    <p className="font-semibold">Client: {invoice.clientName}</p>
                    <p className="text-sm text-gray-600">Email: {invoice.clientEmail}</p>
                    <p className="text-sm text-gray-600">Description: {invoice.serviceDescription}</p>
                    <p className="text-sm font-bold">Amount: ${parseFloat(invoice.amount).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Status: {invoice.status}</p>
                    <p className="text-sm text-gray-600">Created By User ID: {invoice.userId}</p>
                    <p className="text-sm text-gray-600">Created At: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'businesses':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Businesses</h2>
            {businesses.length === 0 ? (
              <p>No businesses found.</p>
            ) : (
              <ul className="space-y-4">
                {businesses.map((business) => (
                  <li key={business.id} className="p-4 bg-gray-50 rounded-lg shadow">
                    <p className="font-semibold">Name: {business.businessName}</p>
                    <p className="text-sm text-gray-600">Owner: {business.ownerName}</p>
                    <p className="text-sm text-gray-600">Type: {business.businessType}</p>
                    <p className="text-sm text-gray-600">Industry: {business.businessIndustry}</p>
                    <p className="text-sm text-gray-600">Created By User ID: {business.userId}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'clients':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Clients</h2>
            {clients.length === 0 ? (
              <p>No clients found.</p>
            ) : (
              <ul className="space-y-4">
                {clients.map((client) => (
                  <li key={client.id} className="p-4 bg-gray-50 rounded-lg shadow">
                    <p className="font-semibold">Name: {client.name}</p>
                    <p className="text-sm text-gray-600">Email: {client.email}</p>
                    <p className="text-sm text-gray-600">Created By User ID: {client.userId}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'services':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Services</h2>
            {services.length === 0 ? (
              <p>No services found.</p>
            ) : (
              <ul className="space-y-4">
                {services.map((service) => (
                  <li key={service.id} className="p-4 bg-gray-50 rounded-lg shadow">
                    <p className="font-semibold">Name: {service.name}</p>
                    <p className="text-sm text-gray-600">Description: {service.description}</p>
                    <p className="text-sm font-bold">Price: ${parseFloat(service.price).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Created By User ID: {service.userId}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Records</h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`${activeTab === 'invoices' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('businesses')}
            className={`${activeTab === 'businesses' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Businesses
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`${activeTab === 'clients' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Clients
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`${activeTab === 'services' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Services
          </button>
        </nav>
      </div>

      {renderContent()}
    </div>
  );
}
