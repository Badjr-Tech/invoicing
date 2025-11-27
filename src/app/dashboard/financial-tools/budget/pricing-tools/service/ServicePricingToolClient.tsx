"use client";

import { useState } from "react";

export default function ServicePricingToolClient() {
  const [hourlyRate, setHourlyRate] = useState<number | string>('');
  const [estimatedHours, setEstimatedHours] = useState<number | string>('');
  const [materialCosts, setMaterialCosts] = useState<number | string>('');
  const [profitMargin, setProfitMargin] = useState<number | string>('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const calculatePrice = () => {
    const hourlyRateValue = parseFloat(hourlyRate as string);
    const estimatedHoursValue = parseFloat(estimatedHours as string);
    const materialCostsValue = parseFloat(materialCosts as string);
    const profitMarginValue = parseFloat(profitMargin as string) / 100; // Convert to decimal

    if (
      isNaN(hourlyRateValue) || isNaN(estimatedHoursValue) || isNaN(materialCostsValue) || isNaN(profitMarginValue) ||
      hourlyRateValue < 0 || estimatedHoursValue < 0 || materialCostsValue < 0 || profitMarginValue < 0
    ) {
      alert("Please enter valid non-negative numbers for all fields.");
      setCalculatedPrice(null);
      return;
    }

    // Calculate total cost: (Hourly Rate * Estimated Hours) + Material Costs
    const totalCost = (hourlyRateValue * estimatedHoursValue) + materialCostsValue;

    // Simple pricing formula: Price = Total Cost / (1 - Profit Margin)
    // Ensure profit margin is less than 1 to avoid division by zero or negative price
    if (profitMarginValue >= 1) {
      alert("Desired Profit Margin must be less than 100%.");
      setCalculatedPrice(null);
      return;
    }

    const price = totalCost / (1 - profitMarginValue);
    setCalculatedPrice(price);
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Service Pricing Tool</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
            Your Hourly Rate ($)
          </label>
          <input
            type="number"
            id="hourlyRate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 50.00"
          />
        </div>
        <div>
          <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
            Estimated Hours for Service
          </label>
          <input
            type="number"
            id="estimatedHours"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 10"
          />
        </div>
        <div>
          <label htmlFor="materialCosts" className="block text-sm font-medium text-gray-700">
            Material/Additional Costs ($)
          </label>
          <input
            type="number"
            id="materialCosts"
            value={materialCosts}
            onChange={(e) => setMaterialCosts(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 25.00"
          />
        </div>
        <div>
          <label htmlFor="profitMargin" className="block text-sm font-medium text-gray-700">
            Desired Profit Margin (%)
          </label>
          <input
            type="number"
            id="profitMargin"
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 20"
          />
        </div>
        <button
          onClick={calculatePrice}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Calculate Service Price
        </button>

        {calculatedPrice !== null && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <h3 className="text-lg font-medium text-green-800">Calculated Service Price: ${calculatedPrice.toFixed(2)}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
