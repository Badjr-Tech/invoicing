"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createInvoice } from "./actions";
import { generateInvoicePDF } from "./pdf";
import Link from "next/link";
import PendingButton from "@/app/components/PendingButton";
import { ChevronDown, ChevronRight, Plus, ReceiptText, X } from "lucide-react";

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
  designation: 'hourly' | 'per deliverable' | 'flat fee';
  serviceNumber: string | null;
  quantity?: number;
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
    services: { name: string; price: string; description: string | null; quantity: number; type: 'hourly' | 'per_deliverable' | 'flat_fee' }[];
    totalAmount: number;
    user: { logoUrl: string | null };
    dueDate: Date | null;
    invoiceNumber: string;
    notes: string | null;
    invoiceBusinessDisplayName: string;
  };
} | undefined;

const inputStyles =
  "block w-full rounded-control border border-clay-200 bg-white px-3 py-2 text-sm text-clay-800 shadow-sm transition placeholder:text-clay-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200/70";

const labelStyles = "block text-sm font-medium text-clay-700";

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
    dbas: { id: number; name: string }[];
  }[];
}) {
  const [state, formAction] = useFormState<FormState, FormData>(createInvoice, undefined);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [, setSelectedClient] = useState<number | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [selectedBusinessObject, setSelectedBusinessObject] = useState<typeof businesses[number] | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [invoiceBusinessDisplayName, setInvoiceBusinessDisplayName] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
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

  const handleRemoveService = (index: number) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedServices = [...selectedServices];
    updatedServices[index].quantity = Number.isNaN(quantity) ? 1 : Math.max(1, quantity);
    setSelectedServices(updatedServices);
  };

  const totalAmount = selectedServices.reduce((acc, service) => acc + (parseFloat(service.price) * (service.quantity ?? 0)), 0);

  const filteredServices = selectedBusinessForServices
    ? services.filter(service => service.businessId === selectedBusinessForServices)
    : services;

  const filteredCategories = selectedBusinessForServices
    ? categories.filter(category => category.businessId === selectedBusinessForServices)
    : categories;

  const servicesByCategory: { [key: string]: Service[] } = {};
  filteredCategories.forEach(category => {
    servicesByCategory[category.name] = filteredServices.filter(service => service.categoryId === category.id);
  });
  servicesByCategory["Uncategorized"] = filteredServices.filter(service => service.categoryId === null);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-clay-800">Create an invoice</h1>
          <p className="mt-1 text-clay-600">
            Pick the services, choose the client, send it.
          </p>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <label htmlFor="businessForServices" className="mb-1.5 block text-xs font-medium text-clay-600">
              Filter services by business
            </label>
            <select
              id="businessForServices"
              name="businessForServices"
              value={selectedBusinessForServices || ''}
              onChange={(e) => {
                const businessId = e.target.value;
                setSelectedBusinessForServices(businessId ? parseInt(businessId) : null);
              }}
              className={inputStyles}
            >
              <option value="">All businesses</option>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.businessName}
                </option>
              ))}
            </select>
          </div>
          <Link
            href="/dashboard/invoices"
            className="rounded-control border border-clay-200 bg-white px-4 py-2 text-sm font-semibold text-clay-700 shadow-sm transition hover:border-sage-300 hover:text-clay-900"
          >
            View invoices
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: service picker */}
        <div className="lg:col-span-2">
          <div className="rounded-card border border-clay-200 bg-white p-5 shadow-card">
            <h2 className="font-display text-lg font-semibold text-clay-800">Services</h2>
            <p className="mt-0.5 text-sm text-clay-600">Click a category, then add what you did.</p>

            <div className="mt-4 space-y-2">
              {Object.entries(servicesByCategory).map(([categoryName, servicesInCat]) => (
                <div key={categoryName} className="overflow-hidden rounded-control border border-clay-200">
                  <button
                    type="button"
                    onClick={() => toggleCategory(categoryName)}
                    className="flex w-full items-center justify-between bg-clay-50 px-4 py-2.5 text-left text-sm font-semibold text-clay-800 transition hover:bg-clay-100"
                  >
                    <span>{categoryName}</span>
                    <span className="flex items-center gap-2 text-clay-500">
                      <span className="text-xs font-normal">{servicesInCat.length}</span>
                      {collapsedCategories[categoryName] ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                    </span>
                  </button>

                  {!collapsedCategories[categoryName] && (
                    <div className="divide-y divide-clay-100">
                      {servicesInCat.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-clay-500">No services in this category.</p>
                      ) : (
                        servicesInCat.map((service) => (
                          <div key={service.id} className="flex items-center justify-between gap-3 px-4 py-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-clay-800">{service.name}</p>
                              {service.description && (
                                <p className="truncate text-xs text-clay-500">{service.description}</p>
                              )}
                              <p className="mt-0.5 text-xs font-semibold text-sage-700">
                                ${service.price}
                                <span className="ml-1 font-normal text-clay-500">· {service.designation}</span>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddService(service)}
                              className="inline-flex shrink-0 items-center gap-1 rounded-control bg-sage-100 px-3 py-1.5 text-xs font-semibold text-sage-800 transition hover:bg-sage-200"
                            >
                              <Plus size={13} /> Add
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: the invoice */}
        <div className="lg:col-span-3">
          <form action={formAction} className="rounded-card border border-clay-200 bg-white p-6 shadow-card">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="businessId" className={labelStyles}>Business</label>
                <select
                  id="businessId"
                  name="businessId"
                  required
                  onChange={(e) => setSelectedBusiness(parseInt(e.target.value))}
                  className={`mt-1.5 ${inputStyles}`}
                >
                  <option value="">Select your business</option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.businessName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="invoiceBusinessDisplayName" className={labelStyles}>
                  Name shown on the invoice
                </label>
                <select
                  id="invoiceBusinessDisplayName"
                  name="invoiceBusinessDisplayName"
                  value={invoiceBusinessDisplayName}
                  onChange={(e) => setInvoiceBusinessDisplayName(e.target.value)}
                  className={`mt-1.5 ${inputStyles}`}
                  required
                >
                  <option value="">Business or DBA name</option>
                  {selectedBusinessObject && (
                    <>
                      <option value={selectedBusinessObject.businessName}>
                        {selectedBusinessObject.businessName}
                      </option>
                      {selectedBusinessObject.dbas.map((dba) => (
                        <option key={dba.id} value={dba.name}>
                          {dba.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="clientId" className={labelStyles}>Client</label>
                <select
                  id="clientId"
                  name="clientId"
                  required
                  onChange={(e) => setSelectedClient(parseInt(e.target.value))}
                  className={`mt-1.5 ${inputStyles}`}
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="invoiceNumber" className={labelStyles}>Invoice #</label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="1042"
                    className={`mt-1.5 ${inputStyles}`}
                  />
                </div>
                <div>
                  <label htmlFor="dueDate" className={labelStyles}>Due date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`mt-1.5 ${inputStyles}`}
                  />
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-clay-500">Line items</h3>

              {selectedServices.length === 0 ? (
                <div className="mt-3 flex flex-col items-center rounded-control border border-dashed border-clay-300 bg-clay-50 px-4 py-8 text-center">
                  <ReceiptText size={22} className="text-clay-400" />
                  <p className="mt-2 text-sm text-clay-600">
                    Nothing here yet — add services from the left.
                  </p>
                </div>
              ) : (
                <div className="mt-3 divide-y divide-clay-100 rounded-control border border-clay-200">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-clay-800">{service.name}</p>
                        <p className="text-xs text-clay-500">
                          ${service.price}
                          {service.designation !== 'flat fee' && ` × ${service.quantity ?? 1}`}
                        </p>
                      </div>
                      {service.designation !== 'flat fee' && (
                        <input
                          type="number"
                          min="1"
                          value={service.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                          aria-label={`Quantity for ${service.name}`}
                          className="w-16 rounded-control border border-clay-200 px-2 py-1 text-center text-sm text-clay-800 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-200"
                        />
                      )}
                      <p className="w-20 text-right text-sm font-semibold text-clay-800">
                        ${(parseFloat(service.price) * (service.quantity ?? 0)).toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(index)}
                        aria-label={`Remove ${service.name}`}
                        className="rounded-full p-1 text-clay-400 transition hover:bg-clay-100 hover:text-clay-700"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between rounded-control bg-clay-50 px-4 py-3">
                <p className="text-sm font-semibold text-clay-700">Total</p>
                <p className="font-display text-xl font-bold text-clay-800">${totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="notes" className={labelStyles}>Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Payment terms, a thank you, anything the client should see."
                className={`mt-1.5 ${inputStyles}`}
              ></textarea>
            </div>

            <input type="hidden" name="services" value={JSON.stringify(selectedServices)} />
            <input type="hidden" name="totalAmount" value={totalAmount} />
            <input type="hidden" name="invoiceNumber" value={invoiceNumber} />
            <input type="hidden" name="notes" value={notes} />
            <input type="hidden" name="invoiceBusinessDisplayName" value={invoiceBusinessDisplayName} />

            {state?.message && (
              <p className="mt-4 rounded-control border border-sage-200 bg-sage-50 px-3.5 py-2.5 text-sm text-clay-800">
                {state.message}
              </p>
            )}
            {state?.error && (
              <p role="alert" className="mt-4 rounded-control border border-ember-200 bg-ember-50 px-3.5 py-2.5 text-sm text-clay-800">
                {state.error}
              </p>
            )}

            <PendingButton
              disabled={selectedServices.length === 0}
              className="mt-6 w-full rounded-control bg-ember-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-700"
              pendingLabel="Creating invoice…"
            >
              Create &amp; send invoice
            </PendingButton>
          </form>
        </div>
      </div>
    </div>
  );
}
