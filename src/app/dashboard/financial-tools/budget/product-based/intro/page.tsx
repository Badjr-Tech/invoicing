import Link from "next/link";

import FileUpload from "@/app/dashboard/components/FileUpload"; // Add import

import Link from "next/link";
import BudgetFileUploadClient from "@/app/dashboard/components/BudgetFileUploadClient"; // Add import

export default function ProductBasedBudgetIntroPage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Product-Based Budget Calculator</h1>

      {/* Short Description - Placeholder for user input */}
      <p className="text-lg text-gray-700 mb-8">
        This section helps product-based businesses create a comprehensive budget, track inventory costs, sales revenue, and calculate profitability for their products. Follow the steps below to get started.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works:</h2>

        {/* Step 1: Copy the Template */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Step 1: Get Your Budget Template</h3>
          <p className="text-lg text-gray-700 mb-4">
            Click the button below to get your own editable copy of the Product-Based Budget Spreadsheet template. This will open in a new tab.
          </p>
          <a
            href="https://docs.google.com/spreadsheets/d/1BZt7YpQjokWzTiy5e4K3C-JpgepTRMx4PDtieVT2Y3Y/copy" // Assuming same template for now, or provide a product-specific one
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Copy Budget Template
          </a>
        </div>

        {/* Step 2: Fill it Out */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Step 2: Fill Out Your Spreadsheet</h3>
          <p className="text-lg text-gray-700">
            Open your copied spreadsheet and fill in your product costs, sales forecasts, and other relevant financial data. Make sure to save your changes.
          </p>
        </div>

        {/* Step 3: Upload for Calculations */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Step 3: Upload for Calculations</h3>
          <p className="text-lg text-gray-700 mb-4">
            Once you've filled out your budget, upload the Excel file below to see your profit calculations and a detailed breakdown.
          </p>
          <BudgetFileUploadClient />
        </div>
      </div>

      {/* How to Price Your Product Button */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Need help pricing your products?</h2>
        <Link href="/dashboard/financial-tools/budget/pricing-tools/product" className="inline-block px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-invoice-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-invoice-blue">
          How to Price Your Product
        </Link>
      </div>
      {/* Proceed to Budget Button */}
      <div className="mt-8 text-center">
        <Link href="/dashboard/financial-tools/budget/product-based" className="inline-block px-8 py-4 border border-transparent text-xl font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Proceed to Product-Based Budget
        </Link>
      </div>
    </div>
  );
}