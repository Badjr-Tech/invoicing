"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

interface BudgetRow {
  month: string;
  income: number | string;
  expenses: number | string;
  cashflow: number;
}

const initialRows: BudgetRow[] = [
  { month: "Month 1", income: '', expenses: '', cashflow: 0 },
  { month: "Month 2", income: '', expenses: '', cashflow: 0 },
  { month: "Month 3", income: '', expenses: '', cashflow: 0 },
  { month: "Month 4", income: '', expenses: '', cashflow: 0 },
  { month: "Month 5", income: '', expenses: '', cashflow: 0 },
  { month: "Month 6", income: '', expenses: '', cashflow: 0 },
];

export default function ServiceBasedBudgetSheet() {
  const [rows, setRows] = useState<BudgetRow[]>(initialRows);

  const handleInputChange = (index: number, field: 'income' | 'expenses', value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    const income = parseFloat(newRows[index].income as string) || 0;
    const expenses = parseFloat(newRows[index].expenses as string) || 0;
    newRows[index].cashflow = income - expenses;

    setRows(newRows);
  };

  const downloadBudget = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Service-Based Budget");
    XLSX.writeFile(workbook, "service-based-budget.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={downloadBudget}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Download Budget
        </button>
      </div>
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
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
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.month}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={row.income}
                    onChange={(e) => handleInputChange(index, 'income', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={row.expenses}
                    onChange={(e) => handleInputChange(index, 'expenses', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${row.cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${row.cashflow.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
