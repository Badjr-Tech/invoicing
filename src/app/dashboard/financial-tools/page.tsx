import Link from 'next/link';

export default function FinancialToolsPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Financial Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/financial-tools/dashboard" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-primary hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent flex flex-col items-center justify-center text-center">
          Financials Dashboard
        </Link>
        <Link href="/dashboard/invoicing" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-invoice-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-invoice-blue flex flex-col items-center justify-center text-center">
          Invoicing
        </Link>
        <Link href="/dashboard/clients" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-secondary hover:bg-secondary-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-accent flex flex-col items-center justify-center text-center">
          Clients
        </Link>
        <Link href="/dashboard/services" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-secondary hover:bg-secondary-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-accent flex flex-col items-center justify-center text-center">
          Services
        </Link>

        <Link href="/dashboard/financial-tools/reporting" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-invoice-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-invoice-blue flex flex-col items-center justify-center text-center">
          Reporting
        </Link>
        <Link href="/dashboard/financial-tools/budget" className="aspect-square border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-primary hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent flex flex-col items-center justify-center text-center">
          Budget
        </Link>
      </div>
    </div>
  );
}
