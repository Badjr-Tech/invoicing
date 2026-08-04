"use client";

import { useState } from "react";

export default function ProductPricingToolClient() {
  const [cogs, setCogs] = useState<number | string>('');
  const [profitMargin, setProfitMargin] = useState<number | string>('');
  const [competitorPrice, setCompetitorPrice] = useState<number | string>('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const calculatePrice = () => {
    const cogsValue = parseFloat(cogs as string);
    const profitMarginValue = parseFloat(profitMargin as string) / 100; // Convert to decimal

    if (isNaN(cogsValue) || isNaN(profitMarginValue) || cogsValue <= 0 || profitMarginValue <= 0) {
      alert("Please enter valid positive numbers for COGS and Desired Profit Margin.");
      setCalculatedPrice(null);
      return;
    }

    // Simple pricing formula: Price = COGS / (1 - Profit Margin)
    const price = cogsValue / (1 - profitMarginValue);
    setCalculatedPrice(price);
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="font-display text-3xl font-semibold text-clay-800 mb-6">Product Pricing Tool</h1>
      <div className="bg-white p-6 rounded-card shadow-card space-y-4">
        <div>
          <label htmlFor="cogs" className="block text-sm font-medium text-clay-700">
            Cost of Goods Sold (COGS)
          </label>
          <input
            type="number"
            id="cogs"
            value={cogs}
            onChange={(e) => setCogs(e.target.value)}
            className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 10.00"
          />
        </div>
        <div>
          <label htmlFor="profitMargin" className="block text-sm font-medium text-clay-700">
            Desired Profit Margin (%)
          </label>
          <input
            type="number"
            id="profitMargin"
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value)}
            className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 30"
          />
        </div>
        <div>
          <label htmlFor="competitorPrice" className="block text-sm font-medium text-clay-700">
            Competitor Price (Optional)
          </label>
          <input
            type="number"
            id="competitorPrice"
            value={competitorPrice}
            onChange={(e) => setCompetitorPrice(e.target.value)}
            className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., 15.00"
          />
        </div>
        <button
          onClick={calculatePrice}
          className="inline-flex justify-center rounded-control border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Calculate Price
        </button>

        {calculatedPrice !== null && (
          <div className="mt-4 p-4 bg-sage-50 rounded-control">
            <h3 className="text-lg font-medium text-sage-800">Calculated Price: ${calculatedPrice.toFixed(2)}</h3>
            {competitorPrice && parseFloat(competitorPrice as string) > 0 && (
              <p className="text-sm text-sage-700">
                Competitor Price: ${parseFloat(competitorPrice as string).toFixed(2)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
