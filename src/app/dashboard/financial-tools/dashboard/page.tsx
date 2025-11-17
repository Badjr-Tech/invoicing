"use client";

import Link from 'next/link';
import { FileText, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { getMonthlyRevenue, getMonthlyNetIncome, getIncomeMinusFees } from '../actions';

interface MonthlyData {
  month: string;
  totalRevenue?: number;
  netIncome?: number;
}

interface IncomeMinusFeesData {
  totalIncome: number;
  totalFees: number;
  netIncome: number;
}

export default function FinancialsDashboardPage() {
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyData[]>([]);
  const [monthlyNetIncomeData, setMonthlyNetIncomeData] = useState<MonthlyData[]>([]);
  const [incomeMinusFees, setIncomeMinusFees] = useState<IncomeMinusFeesData>({ totalIncome: 0, totalFees: 0, netIncome: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const revenue = await getMonthlyRevenue();
        const netIncome = await getMonthlyNetIncome();
        const incomeFees = await getIncomeMinusFees();

        setMonthlyRevenueData(revenue);
        setMonthlyNetIncomeData(netIncome);
        setIncomeMinusFees(incomeFees);
      } catch (err) {
        console.error("Failed to fetch financial data:", err);
        setError("Failed to load financial data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-extrabold text-dark-foreground tracking-tight">Financials Overview</h1>
        <Link href="/dashboard/financial-tools/reporting" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent transition duration-150 ease-in-out">
          Generate Report
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-light-background p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-10 h-10 text-primary mr-4" />
            <h2 className="text-3xl font-bold text-primary-foreground border-b pb-4 mb-4 border-primary-accent flex-grow">Monthly Revenue</h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={monthlyRevenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#ffbd5a" activeDot={{ r: 8 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Net Income Chart */}
        <div className="bg-light-background p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center mb-6">
            <TrendingDown className="w-10 h-10 text-secondary mr-4" />
            <h2 className="text-3xl font-bold text-secondary-accent border-b pb-4 mb-4 border-secondary-accent flex-grow">Monthly Net Income</h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={monthlyNetIncomeData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="netIncome" stroke="#476c2e" activeDot={{ r: 8 }} name="Net Income" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Income Minus Fees Section (retained as a summary) */}
      <div className="bg-light-background p-8 rounded-xl shadow-lg border border-gray-200 col-span-full">
        <div className="flex items-center mb-6">
          <DollarSign className="w-10 h-10 text-primary mr-4" />
          <h2 className="text-3xl font-bold text-primary-foreground border-b pb-4 mb-4 border-primary-accent flex-grow">Current Income Summary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-700 text-lg">Total Income:</p>
            <p className="text-3xl font-extrabold text-secondary-accent">${incomeMinusFees.totalIncome.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-700 text-lg">Total Fees:</p>
            <p className="text-3xl font-extrabold text-red-600">${incomeMinusFees.totalFees.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-700 text-lg">Net Income:</p>
            <p className="text-3xl font-extrabold text-invoice-blue">${incomeMinusFees.netIncome.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}