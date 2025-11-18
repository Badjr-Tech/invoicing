"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createInvoice } from "./actions";
import { generateInvoicePDF } from "./pdf";
import Link from "next/link"; // Import Link
import { useRouter, useSearchParams } from "next/navigation";

interface Service {
  id: number;
  name: string;
  description: string | null;
  price: string; // Price is stored as string in Drizzle schema
  businessId: number | null;
  categoryId: number | null;
  category?: {
    id: number;
    name: string;
  } | null;
  designation: 'hourly' | 'per deliverable' | 'flat fee'; // New field
  serviceNumber: string | null; // New field
  quantity?: number; // Made optional
}

interface ServiceCategory {
  id: number;
  name: string;
  description: string | null;
  businessId: number | null;
}

export type FormState = {
  message: string;
  error: string;
  invoice?: {
    client: { name: string; email: string };
    services: { name: string; price: string; description: string | null; quantity: number; type: 'hourly' | 'per_deliverable' | 'flat_fee' }[]; // Updated service type
    totalAmount: number;
    user: { logoUrl: string | null };
    dueDate: Date | null;
    invoiceNumber: string; // New field
    notes: string | null; // New field
    invoiceBusinessDisplayName: string; // New field
  };
} | undefined;

export default function InvoicingPageClient({
  clients,
  services,
  categories,
  businesses,
}: {
  clients: { id: number; name: string; email: string }[];
  services: Service[];
  categories: ServiceCategory[];
  businesses: {
    id: number;
    businessName: string;
    color1: string | null;
    color2: string | null;
    color3: string | null;
    color4: string | null;
    logoUrl: string | null;
    streetAddress: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    phone: string | null;
    website: string | null;
  }[];
}) {
  const [state, formAction] = useFormState<FormState, FormData>(createInvoice, undefined);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [selectedBusinessObject, setSelectedBusinessObject] = useState<typeof businesses[number] | null>(null); // New state for selected business object
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [invoiceBusinessDisplayName, setInvoiceBusinessDisplayName] = useState<string>('');
  const [dueDate, setDueDate] = useState(''); // New state for due date
  const [selectedBusinessForServices, setSelectedBusinessForServices] = useState<number | null>(null);

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    setDueDate(date.toISOString().split('T')[0]);
  }, []);

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>(() => {
    const initialCollapsedState: Record<string, boolean> = {};
    categories.forEach(category => {
      initialCollapsedState[category.name] = true;
    });
    initialCollapsedState["Uncategorized"] = true;
    return initialCollapsedState;
  });

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories(prevState => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  useEffect(() => {
    const business = businesses.find(b => b.id === selectedBusiness);
    setSelectedBusinessObject(business || null);

    if (business) {
      setInvoiceBusinessDisplayName(business.businessName);
    } else {
      setInvoiceBusinessDisplayName('');
    }
  }, [selectedBusiness, businesses]);

  useEffect(() => {
    if (state?.message && state.invoice) {
      const business = businesses.find(b => b.id === selectedBusiness);
      if (business) {
        generateInvoicePDF(
          state.invoice.client,
          state.invoice.services,
          state.invoice.totalAmount,
          business,
          state.invoice.dueDate,
          state.invoice.invoiceNumber,
          state.invoice.notes,
          state.invoice.invoiceBusinessDisplayName,
        );
      }
      const mailtoLink = `mailto:${state.invoice.client.email}?subject=Invoice ${state.invoice.invoiceNumber}&body=Please find your invoice attached.`;
      window.location.href = mailtoLink;
    }
  }, [state, businesses, selectedBusiness]);

  const handleAddService = (service: Service) => {
    setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedServices = [...selectedServices];
    updatedServices[index].quantity = quantity;
    setSelectedServices(updatedServices);
  };

  const totalAmount = selectedServices.reduce((acc, service) => acc + (parseFloat(service.price) * (service.quantity ?? 0)), 0);

  const filteredServices = selectedBusinessForServices
    ? services.filter(service => service.businessId === selectedBusinessForServices)
    : services;

  const filteredCategories = selectedBusinessForServices
    ? categories.filter(category => category.businessId === selectedBusinessForServices)
    : categories;

  // Group services by category
  const servicesByCategory: { [key: string]: Service[] } = {};
  filteredCategories.forEach(category => {
    servicesByCategory[category.name] = filteredServices.filter(service => service.categoryId === category.id);
  });
  // Add uncategorized services
  servicesByCategory["Uncategorized"] = filteredServices.filter(service => service.categoryId === null);


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Create Invoice</h1>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="businessForServices" className="block text-sm font-medium text-gray-700">
              Filter Services by Business
            </label>
            <select
              id="businessForServices"
              name="businessForServices"
              value={selectedBusinessForServices || ''}
              onChange={(e) => {
                const businessId = e.target.value;
                setSelectedBusinessForServices(businessId ? parseInt(businessId) : null);
              }}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Businesses</option>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.businessName}
                </option>
              ))}
            </select>
          </div>
          <Link href="/dashboard/invoices" className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            View Invoices
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Add Services */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Services</h2>
          <div className="space-y-6">
            {Object.entries(servicesByCategory).map(([categoryName, servicesInCat]) => (
              <div key={categoryName}>
                <h3 className="text-xl font-semibold text-gray-700 mb-3 cursor-pointer flex items-center" onClick={() => toggleCategory(categoryName)}>
                  <span className="mr-2">{collapsedCategories[categoryName] ? '▶' : '▼'}</span>
                  {categoryName}
                </h3>
                {!collapsedCategories[categoryName] && (
                  <>
                    {servicesInCat.length === 0 ? (
                      <p className="text-gray-500">No services in this category.</p>
                    ) : (
                      <div className="space-y-4">
                        {servicesInCat.map((service) => (
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
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Invoice Cart */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoice</h2>
          <form action={formAction} className="space-y-6 bg-invoice-blue p-6 rounded-lg shadow-md text-white">
            <div>
              <label htmlFor="businessId" className="block text-sm font-medium text-white">
                Business Name
              </label>
              <div className="mt-1">
                <select
                  id="businessId"
                  name="businessId"
                  required
                  onChange={(e) => setSelectedBusiness(parseInt(e.target.value))}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select your business</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.businessName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="invoiceBusinessDisplayName" className="block text-sm font-medium text-white">
                Business Line/DBA or Trade Name, if applicable
              </label>
              <div className="mt-1">
                <select
                  id="invoiceBusinessDisplayName"
                  name="invoiceBusinessDisplayName"
                  value={invoiceBusinessDisplayName}
                  onChange={(e) => setInvoiceBusinessDisplayName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select business name for invoice</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.businessName}>
                      {business.businessName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-white">
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

            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-white">
                Invoice Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-white">
                Due Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Selected Services</h3>
              {selectedServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p>{service.name}</p>
                  <div className="flex items-center">
                    {service.designation !== 'flat fee' && (
                      <input
                        type="number"
                        min="1"
                        value={service.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                        className="w-16 text-white px-2 py-1 rounded-md mr-2"
                      />
                    )}
                    {service.designation === 'flat fee' && (
                      <input
                        type="number"
                        value={1} // Flat fee services always have quantity 1
                        disabled
                        className="w-16 text-white px-2 py-1 rounded-md mr-2 bg-gray-200"
                      />
                    )}
                    <p>${(parseFloat(service.price) * (service.quantity ?? 0)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-white">
                Notes
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                ></textarea>
              </div>
            </div>

            <input type="hidden" name="services" value={JSON.stringify(selectedServices)} />
            <input type="hidden" name="totalAmount" value={totalAmount} />
            <input type="hidden" name="invoiceNumber" value={invoiceNumber} />
            <input type="hidden" name="notes" value={notes} />
            <input type="hidden" name="invoiceBusinessDisplayName" value={invoiceBusinessDisplayName} />


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
