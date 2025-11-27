"use client";

import { useState } from "react";

interface CostItem {
  id: number;
  name: string;
  amount: number | string;
}

export default function ServicePricingToolClient() {
  const [step, setStep] = useState(1); // 1: Input Steps, 2: Results

  // Step 1: Service Details
  const [serviceName, setServiceName] = useState<string>('');
  const [baseServiceCost, setBaseServiceCost] = useState<number | string>('');
  const [estimatedHours, setEstimatedHours] = useState<number | string>('');
  const [adminHours, setAdminHours] = useState<number | string>('');
  const [expectedClients, setExpectedClients] = useState<number | string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [numberOfMonths, setNumberOfMonths] = useState<number | string>('');

  // Step 2: Additional Costs
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [nextCostItemId, setNextCostItemId] = useState(0);

  // Step 3: Operational Costs
  const [operationalCostItems, setOperationalCostItems] = useState<CostItem[]>([]);
  const [nextOperationalCostItemId, setNextOperationalCostItemId] = useState(0);

  // Step 4: Profit & Calculation (now part of results)
  const [markupMargin, setMarkupMargin] = useState<number | string>(1.25); // Default to 1.25 as requested
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [totalProfit, setTotalProfit] = useState<number | null>(null);
  const [laborCostBreakdown, setLaborCostBreakdown] = useState<number | null>(null);
  const [additionalCostBreakdown, setAdditionalCostBreakdown] = useState<number | null>(null);
  const [operationalCostBreakdown, setOperationalCostBreakdown] = useState<number | null>(null);


  // Handlers for dynamic cost items
  const addCostItem = () => {
    setCostItems([...costItems, { id: nextCostItemId, name: '', amount: '' }]);
    setNextCostItemId(nextCostItemId + 1);
  };

  const updateCostItem = (id: number, field: keyof CostItem, value: string | number) => {
    setCostItems(costItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeCostItem = (id: number) => {
    setCostItems(costItems.filter(item => item.id !== id));
  };

  // Handlers for dynamic operational cost items
  const addOperationalCostItem = () => {
    setOperationalCostItems([...operationalCostItems, { id: nextOperationalCostItemId, name: '', amount: '' }]);
    setNextOperationalCostItemId(nextOperationalCostItemId + 1);
  };

  const updateOperationalCostItem = (id: number, field: keyof CostItem, value: string | number) => {
    setOperationalCostItems(operationalCostItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeOperationalCostItem = (id: number) => {
    setOperationalCostItems(operationalCostItems.filter(item => item.id !== id));
  };


  const handleProceedToCalculation = () => {
    const baseCostValue = parseFloat(baseServiceCost as string);
    const estimatedHoursValue = parseFloat(estimatedHours as string);
    const adminHoursValue = parseFloat(adminHours as string);
    const expectedClientsValue = parseFloat(expectedClients as string);
    const markupMarginValue = parseFloat(markupMargin as string);
    const numberOfMonthsValue = isRecurring ? parseFloat(numberOfMonths as string) : 1;

    // Validate Step 1 inputs
    if (
      !serviceName ||
      isNaN(baseCostValue) || isNaN(estimatedHoursValue) || isNaN(adminHoursValue) ||
      isNaN(expectedClientsValue) ||
      baseCostValue < 0 || estimatedHoursValue < 0 || adminHoursValue < 0 ||
      expectedClientsValue < 0 || (isRecurring && numberOfMonthsValue <= 0)
    ) {
      alert("Please fill all required fields in Step 1 with valid non-negative numbers.");
      return;
    }

    // Validate markup margin
    if (isNaN(markupMarginValue) || markupMarginValue <= 0) {
      alert("Please enter a valid positive number for Markup Margin.");
      return;
    }

    // Calculate dynamic costs
    const totalAdditionalCosts = costItems.reduce((sum, item) => sum + (parseFloat(item.amount as string) || 0), 0);
    const totalOperationalCosts = operationalCostItems.reduce((sum, item) => sum + (parseFloat(item.amount as string) || 0), 0);

    // Assuming an internal hourly cost for estimated and admin hours
    const internalHourlyCost = 25; // This could also be an input field later

    const totalHoursPerClient = estimatedHoursValue + adminHoursValue;
    const laborCost = (totalHoursPerClient * internalHourlyCost);

    // Total cost per client for the service
    const totalCostPerClient = laborCost + baseCostValue + totalAdditionalCosts + totalOperationalCosts;

    const sellingPricePerClient = totalCostPerClient * markupMarginValue;

    const totalRevenueCalculated = sellingPricePerClient * expectedClientsValue * numberOfMonthsValue;
    const totalCostCalculated = totalCostPerClient * expectedClientsValue * numberOfMonthsValue;
    const totalProfitCalculated = totalRevenueCalculated - totalCostCalculated;

    setCalculatedPrice(sellingPricePerClient);
    setTotalRevenue(totalRevenueCalculated);
    setTotalCost(totalCostCalculated);
    setTotalProfit(totalProfitCalculated);
    setLaborCostBreakdown(laborCost);
    setAdditionalCostBreakdown(totalAdditionalCosts);
    setOperationalCostBreakdown(totalOperationalCosts);

    setStep(2); // Move to results step
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Service Pricing Tool</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6"> {/* Increased space-y for steps */}

        {step === 1 && (
          <>
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
                  <label htmlFor="baseServiceCost" className="block text-sm font-medium text-gray-700">
                    Base Service Cost ($) (e.g., software, external fees per client)
                  </label>
                  <input
                    type="number"
                    id="baseServiceCost"
                    value={baseServiceCost}
                    onChange={(e) => setBaseServiceCost(e.target.value)}
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

            {/* Step 2: Additional Costs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Additional Costs (per client)</h2>
              <div className="space-y-4">
                {costItems.map((item, index) => (
                  <div key={item.id} className="flex space-x-2 items-end">
                    <div className="flex-grow">
                      <label htmlFor={`costName-${item.id}`} className="block text-sm font-medium text-gray-700">
                        Cost Item Name
                      </label>
                      <input
                        type="text"
                        id={`costName-${item.id}`}
                        value={item.name}
                        onChange={(e) => updateCostItem(item.id, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., Software License"
                      />
                    </div>
                    <div className="flex-grow">
                      <label htmlFor={`costAmount-${item.id}`} className="block text-sm font-medium text-gray-700">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        id={`costAmount-${item.id}`}
                        value={item.amount}
                        onChange={(e) => updateCostItem(item.id, 'amount', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., 15.00"
                      />
                    </div>
                    <button
                      onClick={() => removeCostItem(item.id)}
                      className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCostItem}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Add Additional Cost
                </button>
              </div>
            </div>

            {/* Step 3: Operational Costs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Operational Costs (per client)</h2>
              <div className="space-y-4">
                {operationalCostItems.map((item, index) => (
                  <div key={item.id} className="flex space-x-2 items-end">
                    <div className="flex-grow">
                      <label htmlFor={`opCostName-${item.id}`} className="block text-sm font-medium text-gray-700">
                        Operational Cost Item Name
                      </label>
                      <input
                        type="text"
                        id={`opCostName-${item.id}`}
                        value={item.name}
                        onChange={(e) => updateOperationalCostItem(item.id, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., Contractor Fee"
                      />
                    </div>
                    <div className="flex-grow">
                      <label htmlFor={`opCostAmount-${item.id}`} className="block text-sm font-medium text-gray-700">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        id={`opCostAmount-${item.id}`}
                        value={item.amount}
                        onChange={(e) => updateOperationalCostItem(item.id, 'amount', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., 50.00"
                      />
                    </div>
                    <button
                      onClick={() => removeOperationalCostItem(item.id)}
                      className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addOperationalCostItem}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Add Operational Cost
                </button>
              </div>
            </div>

            <button
              onClick={handleProceedToCalculation}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Proceed to Calculation
            </button>
          </>
        )}

        {step === 2 && calculatedPrice !== null && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculation Results</h2>
            <div className="space-y-4">
              {/* Costs Breakdown */}
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Costs Breakdown (per client):</h3>
                <p className="text-sm text-gray-700">Base Service Cost: ${parseFloat(baseServiceCost as string).toFixed(2)}</p>
                <p className="text-sm text-gray-700">Labor Cost (Estimated + Admin Hours): ${laborCostBreakdown?.toFixed(2)}</p>
                {costItems.length > 0 && (
                  <>
                    <p className="text-sm text-gray-700 font-medium mt-2">Additional Costs:</p>
                    {costItems.map(item => (
                      <p key={item.id} className="text-sm text-gray-700 ml-4">{item.name}: ${parseFloat(item.amount as string).toFixed(2)}</p>
                    ))}
                  </>
                )}
                {operationalCostItems.length > 0 && (
                  <>
                    <p className="text-sm text-gray-700 font-medium mt-2">Operational Costs:</p>
                    {operationalCostItems.map(item => (
                      <p key={item.id} className="text-sm text-gray-700 ml-4">{item.name}: ${parseFloat(item.amount as string).toFixed(2)}</p>
                    ))}
                  </>
                )}
                <p className="text-md font-semibold text-gray-800 mt-2">Total Cost per Client: ${totalCostBreakdown?.toFixed(2)}</p>
              </div>

              {/* Margin Input */}
              <div>
                <label htmlFor="markupMargin" className="block text-sm font-medium text-gray-700">
                  Markup Margin (e.g., 1.25 for 25% markup)
                </label>
                <input
                  type="number"
                  id="markupMargin"
                  value={markupMargin}
                  onChange={(e) => setMarkupMargin(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="e.g., 1.25"
                />
              </div>

              {/* Final Calculation */}
              <div className="mt-4 p-4 bg-green-50 rounded-md space-y-2">
                <h3 className="text-lg font-medium text-green-800">Calculated Price per Client: ${calculatedPrice.toFixed(2)}</h3>
                <p className="text-sm text-green-700">Total Estimated Revenue: ${totalRevenue?.toFixed(2)}</p>
                <p className="text-sm text-green-700">Total Estimated Cost: ${totalCost?.toFixed(2)}</p>
                <p className="text-sm text-green-700">Total Estimated Profit: ${totalProfit?.toFixed(2)}</p>
                <p className="text-sm text-green-700">Labor Cost: ${laborCostBreakdown?.toFixed(2)}</p>
                <p className="text-sm text-green-700">Additional Costs: ${additionalCostBreakdown?.toFixed(2)}</p>
                <p className="text-sm text-green-700">Operational Costs: ${operationalCostBreakdown?.toFixed(2)}</p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back to Inputs
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
