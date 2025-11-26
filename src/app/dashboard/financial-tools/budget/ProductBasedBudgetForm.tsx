"use client";

import { useState } from "react";

interface MonthlyData {
  month: string;
  revenue: number;
  cogs: number; // Cost of Goods Sold
  operatingExpenses: number;
  profit: number;
}

export default function ProductBasedBudgetForm() {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(Array(6).fill(0));
  const [monthlyCogs, setMonthlyCogs] = useState<number[]>(Array(6).fill(0));
  const [monthlyOperatingExpenses, setMonthlyOperatingExpenses] = useState<number[]>(Array(6).fill(0));
  const [budgetResults, setBudgetResults] = useState<MonthlyData[]>([]);

  const months = [
    "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"
  ];

  const handleRevenueChange = (index: number, value: string) => {
    const newRevenue = [...monthlyRevenue];
    newRevenue[index] = parseFloat(value) || 0;
    setMonthlyRevenue(newRevenue);
  };

  const handleCogsChange = (index: number, value: string) => {
    const newCogs = [...monthlyCogs];
    newCogs[index] = parseFloat(value) || 0;
    setMonthlyCogs(newCogs);
  };

  const handleOperatingExpensesChange = (index: number, value: string) => {
    const newOperatingExpenses = [...monthlyOperatingExpenses];
    newOperatingExpenses[index] = parseFloat(value) || 0;
    setMonthlyOperatingExpenses(newOperatingExpenses);
  };

  const calculateBudget = () => {
    const results: MonthlyData[] = [];
    for (let i = 0; i < 6; i++) {
      const revenue = monthlyRevenue[i];
      const cogs = monthlyCogs[i];
      const operatingExpenses = monthlyOperatingExpenses[i];
      const profit = revenue - cogs - operatingExpenses;
      results.push({
        month: months[i],
        revenue,
        cogs,
        operatingExpenses,
        profit,
      });
    }
    setBudgetResults(results);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Input */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Projected Revenue</h3>
          {months.map((month, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`revenue-${index}`} className="block text-sm font-medium text-gray-700">
                {month} Revenue
              </label>
              <input
                type="number"
                id={`revenue-${index}`}
                value={monthlyRevenue[index]}
                onChange={(e) => handleRevenueChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        {/* COGS Input */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Projected Cost of Goods Sold (COGS)</h3>
          {months.map((month, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`cogs-${index}`} className="block text-sm font-medium text-gray-700">
                {month} COGS
              </label>
              <input
                type="number"
                id={`cogs-${index}`}
                value={monthlyCogs[index]}
                onChange={(e) => handleCogsChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        {/* Operating Expenses Input */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Projected Operating Expenses</h3>
          {months.map((month, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`operating-expenses-${index}`} className="block text-sm font-medium text-gray-700">
                {month} Operating Expenses
              </label>
              <input
                type="number"
                id={`operating-expenses-${index}`}
                value={monthlyOperatingExpenses[index]}
                onChange={(e) => handleOperatingExpensesChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={calculateBudget}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Calculate Profit
      </button>

      {budgetResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">6-Month Profit Projection</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COGS
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operating Expenses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetResults.map((data, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${data.revenue.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${data.cogs.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${data.operatingExpenses.toFixed(2)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${data.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
