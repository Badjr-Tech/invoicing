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

      {/* Operating Expenses Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Other Financial Tools</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Link href="/dashboard/financial-tools/budget/operating-expenses" className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            Calculate Operating Expenses
          </Link>
        </div>
      </div>

      {/* Your Budgets Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Budgets</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">No budgets created yet. Start by creating a new budget.</p>
          <button className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Add New Budget
          </button>
        </div>
      </div>
    </div>
  );
}