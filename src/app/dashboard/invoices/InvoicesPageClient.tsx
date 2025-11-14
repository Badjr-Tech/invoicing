"use client";

export default function InvoicesPageClient({
  invoices,
}: {
  invoices: {
    id: number;
    clientName: string;
    clientEmail: string;
    serviceDescription: string;
    amount: string;
    status: string;
    createdAt: Date;
  }[];
}) {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Invoices</h1>
      {invoices.length === 0 ? (
        <p className="text-gray-600">No invoices found.</p>
      ) : (
        <ul className="space-y-4">
          {invoices.map((invoice) => (
            <li key={invoice.id} className="p-4 bg-gray-50 rounded-lg shadow">
              <p className="font-semibold">Client: {invoice.clientName}</p>
              <p className="text-sm text-gray-600">Email: {invoice.clientEmail}</p>
              <p className="text-sm text-gray-600">Description: {invoice.serviceDescription}</p>
              <p className="text-sm font-bold">Amount: ${parseFloat(invoice.amount).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Status: {invoice.status}</p>
              <p className="text-sm text-gray-600">Created At: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
