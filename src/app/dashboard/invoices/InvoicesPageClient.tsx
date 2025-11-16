"use client";

import { useRouter, usePathname } from "next/navigation"; // New imports
import { archiveInvoice } from "../invoicing/actions"; // New import
import { useFormState } from "react-dom"; // New import for useFormState

// Define FormState type (assuming it's defined in actions.ts or a shared type file)
type FormState = {
  message: string;
  error: string;
} | undefined;

export default function InvoicesPageClient({
  invoices,
  showArchived,
}: {
  invoices: {
    id: number;
    clientName: string;
    clientEmail: string;
    servicesJson: string; // Changed from serviceDescription
    amount: string;
    status: string;
    createdAt: Date;
    isArchived: boolean;
    invoiceNumber: string; // New
    notes: string | null; // New
    dueDate: Date | null; // New
  }[];
  showArchived: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Wrapper action for useFormState
  const archiveInvoiceAction = async (prevState: FormState, formData: FormData) => {
    const invoiceId = parseInt(formData.get('invoiceId') as string);
    const archiveStatus = formData.get('archiveStatus') === 'true';
    return archiveInvoice(invoiceId, archiveStatus);
  };

  const [state, formAction] = useFormState<FormState, FormData>(archiveInvoiceAction, undefined); // Initialize useFormState with wrapper

  const handleArchiveToggle = () => {
    if (showArchived) {
      router.push(pathname); // Remove showArchived param
    } else {
      router.push(`${pathname}?showArchived=true`); // Add showArchived param
    }
  };

  const handleArchive = async (invoiceId: number, currentArchiveStatus: boolean) => {
    if (window.confirm(`Are you sure you want to ${currentArchiveStatus ? 'unarchive' : 'archive'} this invoice?`)) {
      const formData = new FormData();
      formData.append('invoiceId', invoiceId.toString());
      formData.append('archiveStatus', (!currentArchiveStatus).toString());
      await formAction(formData); // Call the server action via useFormState's formAction
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Invoices</h1>

      {/* New: Archive Toggle */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="showArchived"
          checked={showArchived}
          onChange={handleArchiveToggle}
          className="mr-2"
        />
        <label htmlFor="showArchived" className="text-sm font-medium text-gray-700">
          Show Archived Invoices
        </label>
      </div>

      {invoices.length === 0 ? (
        <p className="text-gray-600">No {showArchived ? 'archived' : 'active'} invoices found.</p>
      ) : (
        <ul className="space-y-4">
          {invoices.map((invoice) => {
            const parsedServices: { name: string; quantity: number; price: string; type: string }[] = JSON.parse(invoice.servicesJson);
            return (
              <li key={invoice.id} className="p-4 bg-gray-50 rounded-lg shadow">
                <p className="font-semibold">Client: {invoice.clientName} (Invoice #: {invoice.invoiceNumber})</p>
                <p className="text-sm text-gray-600">Email: {invoice.clientEmail}</p>
                <p className="text-sm text-gray-600">Services:</p>
                <ul className="list-disc list-inside ml-4">
                  {parsedServices.map((service, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      {service.name} (Qty: {service.quantity}) - ${parseFloat(service.price).toFixed(2)} each ({service.type})
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-bold">Total Amount: ${parseFloat(invoice.amount).toFixed(2)}</p>
                <p className="text-sm text-gray-600">Due Date: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</p>
                <p className="text-sm text-gray-600">Status: {invoice.status}</p>
                <p className="text-sm text-gray-600">Created At: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                {invoice.notes && <p className="text-sm text-gray-600">Notes: {invoice.notes}</p>}
                {invoice.isArchived && <p className="text-sm text-red-500 font-bold">ARCHIVED</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
