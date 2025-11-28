"use client";

import { useState, useEffect } from "react";

interface SavedCalculation {
  id: number;
  name: string;
  calculatedPrice: number | null;
  totalRevenue: number | null;
  totalCost: number | null;
  totalProfit: number | null;
  laborCostBreakdown: number | null;
  additionalCostBreakdown: number | null;
  operationalCostBreakdown: number | null;
  agencyFeeBreakdown: number | null;
  serviceName: string;
  pricingModel: string;
  packageDuration: string;
  markupMargin: string;
  projectedClients: string;
}

export default function ServiceBasedBudgetDisplayPage() {
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  useEffect(() => {
    const storedCalculations = JSON.parse(localStorage.getItem('savedServiceCalculations') || '[]');
    setSavedCalculations(storedCalculations);
  }, []);

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all saved service pricing calculations?")) {
      localStorage.removeItem('savedServiceCalculations');
      setSavedCalculations([]);
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Service-Based Budget</h1>
      <p className="text-lg text-gray-700 mb-6">
        Upload your budget file to see your detailed calculations and profit analysis here.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Service Pricing Calculations</h2>
        {savedCalculations.length === 0 ? (
          <p className="text-gray-600">No saved calculations yet. Go to the Service Pricing Tool to save some!</p>
        ) : (
          <div className="space-y-4">
            {savedCalculations.map((calc) => (
              <div key={calc.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{calc.name}</h3>
                  <p className="text-sm text-gray-600">Service: {calc.serviceName} ({calc.pricingModel})</p>
                  <p className="text-sm text-gray-600">Calculated Price: ${calc.calculatedPrice?.toFixed(2)}</p>
                </div>
                {/* Potentially add a button here to view full details of a saved calculation */}
              </div>
            ))}
            <button
              onClick={handleClearAll}
              className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Clear All Saved Calculations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
