"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link for navigation

export default function BudgetPage() {
  // State to manage which budget creation form is active, if any
  const [activeBudgetForm, setActiveBudgetForm] = useState<"service" | "product" | null>(null);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">6-Month Cashflow Budget</h1>

      {/* Budget Type Selection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/dashboard/financial-tools/budget/service-based" className="flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-center">
          Service-Based Budget
        </Link>
        <Link href="/dashboard/financial-tools/budget/product-based" className="flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary text-center">
          Product-Based Budget
        </Link>
      </div>

      {/* User's Created Budgets List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Budgets</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">List of user&#39;s created budgets will go here.</p>
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