"use client";

import { useRouter, usePathname } from "next/navigation"; // New imports
import { archiveInvoice } from "../invoicing/actions"; // New import
import { useFormState } from "react-dom"; // New import for useFormState

export default function InvoicesPageClient({
  invoices,
  showArchived,
}: {
  invoices: {
    id: number;
    clientName: string;
    clientEmail: string;
    serviceDescription: string;
    amount: string;
    status: string;
    createdAt: Date;
    isArchived: boolean; // New: Include isArchived in type
  }[];
  showArchived: boolean; // New: Accept showArchived prop
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, formAction] = useFormState(archiveInvoice, undefined); // Initialize useFormState

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
      await formAction(formData); // Call the server action
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
          {invoices.map((invoice) => (
            <li key={invoice.id} className="p-4 bg-gray-50 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">Client: {invoice.clientName}</p>
                <p className="text-sm text-gray-600">Email: {invoice.clientEmail}</p>
                <p className="text-sm text-gray-600">Description: {invoice.serviceDescription}</p>
                <p className="text-sm font-bold">Amount: ${parseFloat(invoice.amount).toFixed(2)}</p>
                <p className="text-sm text-gray-600">Status: {invoice.status}</p>
                <p className="text-sm text-gray-600">Created At: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                {invoice.isArchived && <p className="text-sm text-red-500 font-bold">ARCHIVED</p>}
              </div>
              <button
                onClick={() => handleArchive(invoice.id, invoice.isArchived)}
                className={`ml-4 px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${invoice.isArchived ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              >
                {invoice.isArchived ? 'Unarchive' : 'Archive'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
