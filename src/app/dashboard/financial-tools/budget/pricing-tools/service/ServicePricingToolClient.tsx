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
  const [currentServicePrice, setCurrentServicePrice] = useState<number | string>('');
  const [estimatedHours, setEstimatedHours] = useState<number | string>('');
  const [adminHours, setAdminHours] = useState<number | string>('');
  const [yourHourlyRate, setYourHourlyRate] = useState<number | string>('');
  const [pricingModel, setPricingModel] = useState<'one-time' | 'monthly' | 'package'>('one-time'); // Updated default
  const [packageDuration, setPackageDuration] = useState<number | string>(''); // New state for package duration

  // Step 2: Additional Costs
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [nextCostItemId, setNextCostItemId] = useState(0);

  // Step 3: Operational Costs
  const [operationalCostItems, setOperationalCostItems] = useState<CostItem[]>([]); // No default agency fee
  const [nextOperationalCostItemId, setNextOperationalCostItemId] = useState(0); // Start from 0 for next custom item
  const [servicesInSixMonths, setServicesInSixMonths] = useState<number | string>(''); // New state

  // Step 4: Profit & Calculation (now part of results)
  const [markupMargin, setMarkupMargin] = useState<number | string>(1.25); // Default to 1.25 as requested
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [totalProfit, setTotalProfit] = useState<number | null>(null);
  const [laborCostBreakdown, setLaborCostBreakdown] = useState<number | null>(null);
  const [additionalCostBreakdown, setAdditionalCostBreakdown] = useState<number | null>(null);
  const [operationalCostBreakdown, setOperationalCostBreakdown] = useState<number | null>(null);
  const [agencyFeeBreakdown, setAgencyFeeBreakdown] = useState<number | null>(null); // New state for agency fee breakdown

  // New state for expected clients in results section
  const [projectedClients, setProjectedClients] = useState<number | string>('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');


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
    const currentServicePriceValue = parseFloat(currentServicePrice as string);
    const estimatedHoursValue = parseFloat(estimatedHours as string);
    const adminHoursValue = parseFloat(adminHours as string);
    const yourHourlyRateValue = parseFloat(yourHourlyRate as string);
    const markupMarginValue = parseFloat(markupMargin as string);
    const packageDurationValue = parseFloat(packageDuration as string) || 1; // Default to 1 for package
    const servicesInSixMonthsValue = parseFloat(servicesInSixMonths as string) || 1; // Default to 1 to avoid division by zero

    // Validate Step 1 inputs
    if (
      !serviceName ||
      isNaN(estimatedHoursValue) || isNaN(adminHoursValue) || isNaN(yourHourlyRateValue) ||
      estimatedHoursValue < 0 || adminHoursValue < 0 || yourHourlyRateValue < 0 ||
      (pricingModel === 'package' && packageDurationValue <= 0)
    ) {
      alert("Please fill all required fields in Step 1 with valid non-negative numbers.");
      return;
    }

    // Validate Step 3 inputs
    if (isNaN(servicesInSixMonthsValue) || servicesInSixMonthsValue <= 0) {
      alert("Please enter a valid positive number for 'Number of Services Provided in a 6-Month Period' in Step 3.");
      return;
    }

    // Validate markup margin
    if (isNaN(markupMarginValue) || markupMarginValue <= 0) {
      alert("Please enter a valid positive number for Markup Margin.");
      return;
    }

    // Calculate total hours per service
    const totalHoursPerService = estimatedHoursValue + adminHoursValue;

    const laborCostPerService = (totalHoursPerService * yourHourlyRateValue);

    // Calculate dynamic costs
    const totalAdditionalCosts = costItems.reduce((sum, item) => sum + (parseFloat(item.amount as string) || 0), 0);

    // Sum up operational costs (no agency fee here)
    let totalOperationalCostsSum = operationalCostItems.reduce((sum, item) => {
      return sum + (parseFloat(item.amount as string) || 0);
    }, 0);

    // Divide total operational costs by the number of services in 6 months
    const perServiceOperationalCost = totalOperationalCostsSum / servicesInSixMonthsValue;

    // Total cost per service (before agency fee)
    const totalCostPerServiceBeforeAgencyFee = laborCostPerService + totalAdditionalCosts + perServiceOperationalCost;

    let sellingPricePerService = totalCostPerServiceBeforeAgencyFee * markupMarginValue;

    // Adjust selling price based on pricing model if it's a package
    if (pricingModel === 'package') {
      sellingPricePerService = sellingPricePerService * packageDurationValue;
    }

    // Now calculate Agency Fee (5% of sellingPricePerService)
    const agencyFeeAmount = sellingPricePerService * 0.05;

    // Set agency fee breakdown
    setAgencyFeeBreakdown(agencyFeeAmount);

    // Initial calculation for 1 client for display, actual projection will use projectedClients
    const initialProjectedClients = parseFloat(projectedClients as string) || 1; // Default to 1 for initial calculation

    // Adjust total revenue and profit by subtracting the agency fee
    let totalRevenueCalculated = sellingPricePerService * initialProjectedClients;
    let totalCostCalculated = totalCostPerServiceBeforeAgencyFee * initialProjectedClients; // Use cost before agency fee

    if (pricingModel === 'monthly' || pricingModel === 'package') {
      const duration = parseFloat(packageDuration as string) || 1;
      totalRevenueCalculated = totalRevenueCalculated * duration;
      totalCostCalculated = totalCostCalculated * duration;
    }

    // Subtract agency fee from revenue and profit
    totalRevenueCalculated -= (agencyFeeAmount * initialProjectedClients);
    const totalProfitCalculated = totalRevenueCalculated - totalCostCalculated;

    setCalculatedPrice(sellingPricePerService); // This is now price per service
    setTotalRevenue(totalRevenueCalculated);
    setTotalCost(totalCostCalculated);
    setTotalProfit(totalProfitCalculated);
    setLaborCostBreakdown(laborCostPerService);
    setAdditionalCostBreakdown(totalAdditionalCosts);
    setOperationalCostBreakdown(perServiceOperationalCost); // Display per-service operational cost

    setStep(2); // Move to results step
  };

  const handleSaveCalculation = () => {
    if (!saveName.trim()) {
      alert("Please enter a name for your saved calculation.");
      return;
    }

    const savedCalculations = JSON.parse(localStorage.getItem('savedServiceCalculations') || '[]');
    const newCalculation = {
      id: Date.now(), // Unique ID
      name: saveName,
      calculatedPrice: calculatedPrice,
      totalRevenue: totalRevenue,
      totalCost: totalCost,
      totalProfit: totalProfit,
      laborCostBreakdown: laborCostBreakdown,
      additionalCostBreakdown: additionalCostBreakdown,
      operationalCostBreakdown: operationalCostBreakdown,
      agencyFeeBreakdown: agencyFeeBreakdown,
      // Include other relevant inputs if needed for full context
      serviceName: serviceName,
      pricingModel: pricingModel,
      packageDuration: packageDuration,
      markupMargin: markupMargin,
      projectedClients: projectedClients,
    };

    localStorage.setItem('savedServiceCalculations', JSON.stringify([...savedCalculations, newCalculation]));
    alert(`Calculation "${saveName}" saved successfully!`);
    setShowSaveModal(false);
    setSaveName('');
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
                  <label htmlFor="currentServicePrice" className="block text-sm font-medium text-gray-700">
                    Current Service Price ($) (if applicable)
                  </label>
                  <input
                    type="number"
                    id="currentServicePrice"
                    value={currentServicePrice}
                    onChange={(e) => setCurrentServicePrice(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., 500.00"
                  />
                </div>
                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                    Estimated Hours Required to Deliver Service
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
                    Additional Admin Hours (prep, communication, revisions)
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
                  <label htmlFor="yourHourlyRate" className="block text-sm font-medium text-gray-700">
                    Your Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    id="yourHourlyRate"
                    value={yourHourlyRate}
                    onChange={(e) => setYourHourlyRate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., 50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Pricing Model
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="pricingModel"
                        value="one-time"
                        checked={pricingModel === 'one-time'}
                        onChange={() => setPricingModel('one-time')}
                      />
                      <span className="ml-2 text-sm text-gray-900">One-Time Fee</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="pricingModel"
                        value="monthly"
                        checked={pricingModel === 'monthly'}
                        onChange={() => setPricingModel('monthly')}
                      />
                      <span className="ml-2 text-sm text-gray-900">Monthly Fee</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="pricingModel"
                        value="package"
                        checked={pricingModel === 'package'}
                        onChange={() => setPricingModel('package')}
                      />
                      <span className="ml-2 text-sm text-gray-900">Package</span>
                    </label>
                  </div>
                </div>
                {pricingModel === 'package' && (
                  <div>
                    <label htmlFor="packageDuration" className="block text-sm font-medium text-gray-700">
                      Number of Months/Instances in Package
                    </label>
                    <input
                      type="number"
                      id="packageDuration"
                      value={packageDuration}
                      onChange={(e) => setPackageDuration(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., 3 (for 3 months) or 5 (for 5 instances)"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Additional Costs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Additional Non-Operational Costs (specific to the service)</h2>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Operational Costs</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="servicesInSixMonths" className="block text-sm font-medium text-gray-700">
                    Number of Services Provided in a 6-Month Period
                  </label>
                  <input
                    type="number"
                    id="servicesInSixMonths"
                    value={servicesInSixMonths}
                    onChange={(e) => setServicesInSixMonths(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., 100"
                  />
                </div>
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
                        onChange={(e) => item.name !== 'AGENCY FEE' && updateOperationalCostItem(item.id, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., Contractor Fee"
                        readOnly={item.name === 'AGENCY FEE'}
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
                        onChange={(e) => item.name !== 'AGENCY FEE' && updateOperationalCostItem(item.id, 'amount', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., 50.00"
                        readOnly={item.name === 'AGENCY FEE'}
                      />
                    </div>
                    <button
                      onClick={() => removeOperationalCostItem(item.id)}
                      className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      disabled={item.name === 'AGENCY FEE'}
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
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
              {/* Left Side: Costs Breakdown */}
              <div className="md:w-1/2 p-4 bg-gray-50 rounded-md space-y-2">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Costs Breakdown (per service):</h3>
                <p className="text-sm text-gray-700">Labor Cost (Estimated + Admin Hours): ${laborCostBreakdown?.toFixed(2)}</p>
                {costItems.length > 0 && (
                  <>
                    <p className="text-sm text-gray-700 font-medium mt-2">Additional Costs:</p>
                    {costItems.map(item => (
                      <p key={item.id} className="text-sm text-gray-700 ml-4">{item.name}: ${parseFloat(item.amount as string).toFixed(2)}</p>
                    ))}
                  </>
                )}
                {operationalCostBreakdown !== null && (
                  <p className="text-sm text-gray-700 font-medium mt-2">Operational Costs (per service): ${operationalCostBreakdown?.toFixed(2)}</p>
                )}
                <p className="text-md font-semibold text-gray-800 mt-2">Total Cost per Service: ${totalCost?.toFixed(2)}</p>
              </div>

              {/* Right Side: Final Calculation & Recommended Price */}
              <div className="md:w-1/2 flex flex-col space-y-4">
                {/* Margin Input */}
                <div className="p-4 bg-white rounded-md shadow-sm">
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

                {/* Projected Clients Input */}
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <label htmlFor="projectedClients" className="block text-sm font-medium text-gray-700">
                    Projected Number of Clients
                  </label>
                  <input
                    type="number"
                    id="projectedClients"
                    value={projectedClients}
                    onChange={(e) => setProjectedClients(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., 5"
                  />
                </div>

                {/* Simplified Final Calculation */}
                <div className="p-4 bg-green-50 rounded-md space-y-2">
                  <h3 className="text-lg font-medium text-green-800">Calculated Price per Service:</h3>
                  <p className="text-sm text-green-700">Total Estimated Revenue: ${totalRevenue?.toFixed(2)}</p>
                  <p className="text-sm text-green-700">Total Estimated Cost: ${totalCost?.toFixed(2)}</p>
                  <p className="text-sm text-green-700">Total Estimated Profit: ${totalProfit?.toFixed(2)}</p>
                  <p className="text-sm text-green-700">Labor Cost: ${laborCostBreakdown?.toFixed(2)}</p>
                  {agencyFeeBreakdown !== null && (
                    <p className="text-sm text-green-700">Agency Fee: ${agencyFeeBreakdown?.toFixed(2)}</p>
                  )}
                </div>

                {/* Recommended Price */}
                <div className="p-4 bg-indigo-100 rounded-md text-right">
                  <p className="text-xl font-bold text-indigo-800">Recommended Price: ${Math.ceil(calculatedPrice).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-6 inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back to Inputs
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="mt-6 ml-4 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save Price
            </button>

            {showSaveModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Save Price Calculation</h3>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter a name for this calculation"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                  />
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCalculation} // This function will be implemented next
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
