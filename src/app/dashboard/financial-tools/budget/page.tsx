"use client";

import { useState } from "react";
import ServiceBasedBudgetForm from "./ServiceBasedBudgetForm";
import ProductBasedBudgetForm from "./ProductBasedBudgetForm";

export default function BudgetPage() {
  const [showBudgetSelection, setShowBudgetSelection] = useState(true);
  const [budgetType, setBudgetType] = useState<"service" | "product" | null>(null);

  const handleBudgetTypeSelect = (type: "service" | "product") => {
    setBudgetType(type);
    setShowBudgetSelection(false);
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">6-Month Cashflow Budget</h1>

      {showBudgetSelection && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Select Budget Type</h2>
            <p className="mb-6 text-gray-700">Would you like to create a service-based budget or a product-based budget?</p>
            <div className="flex justify-around space-x-4">
              <button
                onClick={() => handleBudgetTypeSelect("service")}
                className="flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Service-Based
              </button>
              <button
                onClick={() => handleBudgetTypeSelect("product")}
                className="flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Product-Based
              </button>
            </div>
          </div>
        </div>
      )}

      {!showBudgetSelection && budgetType === "service" && (
        <ServiceBasedBudgetForm />
      )}

      {!showBudgetSelection && budgetType === "product" && (
        <ProductBasedBudgetForm />
      )}
    </div>
  );
}