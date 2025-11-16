import Link from 'next/link';
import { FileText, CheckCircle, DollarSign } from 'lucide-react';
import { getOutstandingInvoices, getSuccessfulPayments, getIncomeMinusFees } from '../actions'; // Adjust path as needed

export default async function FinancialsDashboardPage() {
  const outstandingInvoices = await getOutstandingInvoices();
  const successfulPayments = await getSuccessfulPayments();
  const incomeMinusFees = await getIncomeMinusFees();

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Financials Overview</h1>
        <Link href="/dashboard/financial-tools/reporting" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
          Generate Report
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Outstanding Invoices Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <FileText className="w-10 h-10 text-indigo-500 mr-4" />
            <h2 className="text-3xl font-bold text-indigo-700 border-b pb-4 mb-4 border-indigo-100 flex-grow">Outstanding Invoices</h2>
          </div>
          <p className="text-gray-700 text-xl mb-2">Total: <span className="text-3xl font-extrabold text-indigo-600">${outstandingInvoices.totalAmount.toFixed(2)}</span></p>
          <p className="text-gray-600 mb-4">Number of invoices: <span className="font-semibold">{outstandingInvoices.count}</span></p>
          {outstandingInvoices.invoices.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {outstandingInvoices.invoices.map((invoice, index) => (
                <li key={invoice.id} className={`flex justify-between items-center p-3 rounded-md ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <span className="text-gray-800 text-base">Invoice #{invoice.invoiceNumber}</span>
                  <span className="font-semibold text-indigo-600">${parseFloat(invoice.amount).toFixed(2)}</span>
                  <span className="text-gray-500 text-sm ml-2">(Client: {invoice.clientName})</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 p-4 bg-gray-50 rounded-md text-gray-500 text-center">
              No outstanding invoices.
            </div>
          )}
        </div>

        {/* Successful Payments Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500 mr-4" />
            <h2 className="text-3xl font-bold text-green-700 border-b pb-4 mb-4 border-green-100 flex-grow">Successful Payments</h2>
          </div>
          <p className="text-gray-700 text-xl mb-2">Total: <span className="text-3xl font-extrabold text-green-600">${successfulPayments.totalAmount.toFixed(2)}</span></p>
          <p className="text-gray-600 mb-4">Number of payments: <span className="font-semibold">{successfulPayments.count}</span></p>
          {successfulPayments.invoices.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {successfulPayments.invoices.map((invoice, index) => (
                <li key={invoice.id} className={`flex justify-between items-center p-3 rounded-md ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <span className="text-gray-800 text-base">Invoice #{invoice.invoiceNumber}</span>
                  <span className="font-semibold text-green-600">${parseFloat(invoice.amount).toFixed(2)}</span>
                  <span className="text-gray-500 text-sm ml-2">(Client: {invoice.clientName})</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 p-4 bg-gray-50 rounded-md text-gray-500 text-center">
              No successful payments.
            </div>
          )}
        </div>

        {/* Income Minus Fees Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 col-span-full">
          <div className="flex items-center mb-6">
            <DollarSign className="w-10 h-10 text-purple-500 mr-4" />
            <h2 className="text-3xl font-bold text-purple-700 border-b pb-4 mb-4 border-purple-100 flex-grow">Income Minus Fees</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-700 text-lg">Total Income:</p>
              <p className="text-3xl font-extrabold text-purple-600">${incomeMinusFees.totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-700 text-lg">Total Fees:</p>
              <p className="text-3xl font-extrabold text-red-600">${incomeMinusFees.totalFees.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-700 text-lg">Net Income:</p>
              <p className="text-3xl font-extrabold text-blue-600">${incomeMinusFees.netIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}