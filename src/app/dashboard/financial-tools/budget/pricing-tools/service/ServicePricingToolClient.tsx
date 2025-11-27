"use client";

import { useState } from "react";

export default function ServicePricingToolClient() {
  // Step 1: Service Details
  const [serviceName, setServiceName] = useState<string>('');
  const [baseServicePrice, setBaseServicePrice] = useState<number | string>('');
  const [estimatedHours, setEstimatedHours] = useState<number | string>('');
  const [adminHours, setAdminHours] = useState<number | string>('');

  // Step 2: Client & Recurring Details
  const [expectedClients, setExpectedClients] = useState<number | string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [numberOfMonths, setNumberOfMonths] = useState<number | string>('');

  // Step 3: Profit & Calculation
  const [profitMargin, setProfitMargin] = useState<number | string>('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [totalProfit, setTotalProfit] = useState<number | null>(null);


  const calculatePrice = () => {
    const basePriceValue = parseFloat(baseServicePrice as string);
    const estimatedHoursValue = parseFloat(estimatedHours as string);
    const adminHoursValue = parseFloat(adminHours as string);
    const expectedClientsValue = parseFloat(expectedClients as string);
    const profitMarginValue = parseFloat(profitMargin as string) / 100;
    const numberOfMonthsValue = isRecurring ? parseFloat(numberOfMonths as string) : 1;

    if (
      isNaN(basePriceValue) || isNaN(estimatedHoursValue) || isNaN(adminHoursValue) ||
      isNaN(expectedClientsValue) || isNaN(profitMarginValue) ||
      basePriceValue < 0 || estimatedHoursValue < 0 || adminHoursValue < 0 ||
      expectedClientsValue < 0 || profitMarginValue < 0 || (isRecurring && numberOfMonthsValue <= 0)
    ) {
      alert("Please enter valid non-negative numbers for all required fields.");
      setCalculatedPrice(null);
      setTotalRevenue(null);
      setTotalCost(null);
      setTotalProfit(null);
      return;
    }

    if (profitMarginValue >= 1) {
      alert("Desired Profit Margin must be less than 100%.");
      setCalculatedPrice(null);
      setTotalRevenue(null);
      setTotalCost(null);
      setTotalProfit(null);
      return;
    }

    // Assuming an hourly rate for estimated and admin hours for cost calculation
    // For simplicity, let's assume a fixed internal hourly cost for now, e.g., $25/hour
    const internalHourlyCost = 25;

    const totalHoursPerClient = estimatedHoursValue + adminHoursValue;
    const costPerClient = (totalHoursPerClient * internalHourlyCost); // Internal cost per client

    // If baseServicePrice is the price you charge, then cost is derived from it
    // If baseServicePrice is the cost, then price is derived from it.
    // Let's assume baseServicePrice is the *cost* for now, and we calculate the *selling price*.
    const totalCostPerClient = costPerClient + basePriceValue; // Total internal cost for the service

    const sellingPricePerClient = totalCostPerClient / (1 - profitMarginValue);

    const monthlyRevenuePerClient = sellingPricePerClient;
    const monthlyCostPerClient = totalCostPerClient;
    const monthlyProfitPerClient = monthlyRevenuePerClient - monthlyCostPerClient;

    const totalRevenueCalculated = monthlyRevenuePerClient * expectedClientsValue * numberOfMonthsValue;
    const totalCostCalculated = monthlyCostPerClient * expectedClientsValue * numberOfMonthsValue;
    const totalProfitCalculated = totalRevenueCalculated - totalCostCalculated;

    setCalculatedPrice(sellingPricePerClient);
    setTotalRevenue(totalRevenueCalculated);
    setTotalCost(totalCostCalculated);
    setTotalProfit(totalProfitCalculated);
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Service Pricing Tool</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6"> {/* Increased space-y for steps */}

        {/* Step 1: Service Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Service Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
                Service Name
              </label>
              <input
                type="text"
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., Social Media Management"
              />
            </div>
            <div>
              <label htmlFor="baseServicePrice" className="block text-sm font-medium text-gray-700">
                Base Service Cost ($) (e.g., software, external fees)
              </label>
              <input
                type="number"
                id="baseServicePrice"
                value={baseServicePrice}
                onChange={(e) => setBaseServicePrice(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 100.00"
              />
            </div>
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                Estimated Hours Required to Deliver Service (per client)
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
              <label htmlFor="adminHours" className="block text-sm font-medium text-gray-700">
                Additional Admin Hours (prep, communication, revisions per client)
              </label>
              <input
                type="number"
                id="adminHours"
                value={adminHours}
                onChange={(e) => setAdminHours(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 2"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Client & Recurring Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Client & Recurring Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="expectedClients" className="block text-sm font-medium text-gray-700">
                Expected Number of Clients per Month
              </label>
              <input
                type="number"
                id="expectedClients"
                value={expectedClients}
                onChange={(e) => setExpectedClients(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., 5"
              />
            </div>
            <div className="flex items-center">
              <input
                id="isRecurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
                Recurring Service
              </label>
            </div>
            {isRecurring && (
              <div>
                <label htmlFor="numberOfMonths" className="block text-sm font-medium text-gray-700">
                  Number of Months for Recurring Package (optional, default 1)
                </label>
                <input
                  type="number"
                  id="numberOfMonths"
                  value={numberOfMonths}
                  onChange={(e) => setNumberOfMonths(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g., 6"
                />
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Profit & Calculation */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Desired Profit & Calculation</h2>
          <div className="space-y-4">
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
          </div>
        </div>

        {calculatedPrice !== null && (
          <div className="mt-4 p-4 bg-green-50 rounded-md space-y-2">
            <h3 className="text-lg font-medium text-green-800">Calculated Price per Client: ${calculatedPrice.toFixed(2)}</h3>
            <p className="text-sm text-green-700">Total Estimated Revenue: ${totalRevenue?.toFixed(2)}</p>
            <p className="text-sm text-green-700">Total Estimated Cost: ${totalCost?.toFixed(2)}</p>
            <p className="text-sm text-green-700">Total Estimated Profit: ${totalProfit?.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
