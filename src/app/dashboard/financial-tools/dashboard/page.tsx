import Link from 'next/link';
import { getOutstandingInvoices, getSuccessfulPayments, getIncomeMinusFees } from '../actions'; // Adjust path as needed

export default async function FinancialsDashboardPage() {
  const outstandingInvoices = await getOutstandingInvoices();
  const successfulPayments = await getSuccessfulPayments();
  const incomeMinusFees = await getIncomeMinusFees();

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Financials Dashboard</h1>
        <Link href="/dashboard/financial-tools/reporting" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Reporting
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Outstanding Invoices Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Outstanding Invoices</h2>
          <p className="text-gray-700">Total: ${outstandingInvoices.totalAmount.toFixed(2)}</p>
          <p className="text-gray-700">Number of invoices: {outstandingInvoices.count}</p>
          {outstandingInvoices.invoices.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {outstandingInvoices.invoices.map(invoice => (
                <li key={invoice.id} className="text-gray-700 text-sm">
                  Invoice #{invoice.invoiceNumber} - ${parseFloat(invoice.amount).toFixed(2)} (Client: {invoice.clientName})
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 space-y-2">
              <li className="text-gray-500">No outstanding invoices.</li>
            </ul>
          )}
        </div>

        {/* Successful Payments Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Successful Payments</h2>
          <p className="text-gray-700">Total: ${successfulPayments.totalAmount.toFixed(2)}</p>
          <p className="text-gray-700">Number of payments: {successfulPayments.count}</p>
          {successfulPayments.invoices.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {successfulPayments.invoices.map(invoice => (
                <li key={invoice.id} className="text-gray-700 text-sm">
                  Invoice #{invoice.invoiceNumber} - ${parseFloat(invoice.amount).toFixed(2)} (Client: {invoice.clientName})
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 space-y-2">
              <li className="text-gray-500">No successful payments.</li>
            </ul>
          )}
        </div>

        {/* Income Minus Fees Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Income Minus Fees</h2>
          <p className="text-gray-700">Total Income: ${incomeMinusFees.totalIncome.toFixed(2)}</p>
          <p className="text-gray-700">Total Fees: ${incomeMinusFees.totalFees.toFixed(2)}</p>
          <p className="text-gray-700 font-bold">Net Income: ${incomeMinusFees.netIncome.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}