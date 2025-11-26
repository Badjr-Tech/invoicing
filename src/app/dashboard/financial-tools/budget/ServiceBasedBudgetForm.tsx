"use client";

import { useState } from "react";

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  cashflow: number;
}

export default function ServiceBasedBudgetForm() {
  const [monthlyIncome, setMonthlyIncome] = useState<number[]>(Array(6).fill(0));
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>(Array(6).fill(0));
  const [budgetResults, setBudgetResults] = useState<MonthlyData[]>([]);

  const months = [
    "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"
  ];

  const handleIncomeChange = (index: number, value: string) => {
    const newIncome = [...monthlyIncome];
    newIncome[index] = parseFloat(value) || 0;
    setMonthlyIncome(newIncome);
  };

  const handleExpensesChange = (index: number, value: string) => {
    const newExpenses = [...monthlyExpenses];
    newExpenses[index] = parseFloat(value) || 0;
    setMonthlyExpenses(newExpenses);
  };

  const calculateBudget = () => {
    const results: MonthlyData[] = [];
    for (let i = 0; i < 6; i++) {
      const income = monthlyIncome[i];
      const expenses = monthlyExpenses[i];
      const cashflow = income - expenses;
      results.push({
        month: months[i],
        income,
        expenses,
        cashflow,
      });
    }
    setBudgetResults(results);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Input */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Projected Income</h3>
          {months.map((month, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`income-${index}`} className="block text-sm font-medium text-gray-700">
                {month} Income
              </label>
              <input
                type="number"
                id={`income-${index}`}
                value={monthlyIncome[index]}
                onChange={(e) => handleIncomeChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        {/* Expenses Input */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Projected Expenses</h3>
          {months.map((month, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`expenses-${index}`} className="block text-sm font-medium text-gray-700">
                {month} Expenses
              </label>
              <input
                type="number"
                id={`expenses-${index}`}
                value={monthlyExpenses[index]}
                onChange={(e) => handleExpensesChange(index, e.target.value)}
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
        Calculate Cashflow
      </button>

      {budgetResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">6-Month Cashflow Projection</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cashflow
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetResults.map((data, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${data.income.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${data.expenses.toFixed(2)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${data.cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${data.cashflow.toFixed(2)}
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
