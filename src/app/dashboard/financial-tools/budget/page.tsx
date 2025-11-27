"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link for navigation

export default function BudgetPage() {
  // State to manage which budget creation form is active, if any
  const [activeBudgetForm, setActiveBudgetForm] = useState<"service" | "product" | null>(null);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">6-Month Cashflow Budget</h1>

      {/* Budget Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> {/* Increased gap for better separation */}
        {/* Service-Based Budget Pipeline */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Service-Based Budget</h2>
          <p className="text-gray-700 mb-4">
            Create a detailed budget for your service-based business. This tool helps you track income, expenses, and calculate profit margins specific to services.
          </p>
          <Link href="/dashboard/financial-tools/budget/service-based/intro" className="block w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-center">
            Go to Service-Based Budget
          </Link>
        </div>

        {/* Product-Based Budget Pipeline */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Product-Based Budget</h2>
          <p className="text-gray-700 mb-4">
            Develop a comprehensive budget for your product-based business. Analyze costs, sales, and profitability for physical or digital products.
          </p>
          <Link href="/dashboard/financial-tools/budget/product-based/intro" className="block w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary text-center">
            Go to Product-Based Budget
          </Link>
        </div>
      </div>

      {/* User's Created Budgets List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Budgets</h2>
          <button
            // onClick={() => openUploadModal()} // Placeholder for modal logic
            className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Budget
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">List of user&#39;s created budgets will go here.</p>
          {/* This section will eventually list the uploaded budgets */}
        </div>
      </div>

      {/* Pricing Tools Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pricing Tools</h2>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/financial-tools/budget/pricing-tools/product" className="flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-invoice-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-invoice-blue text-center">
            How to Price Your Product
          </Link>
          <Link href="/dashboard/financial-tools/budget/pricing-tools/service" className="flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-secondary-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-accent text-center">
            How to Price Your Service
          </Link>
        </div>
      </div>
    </div>
  );
}