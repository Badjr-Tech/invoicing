"use client";

import Link from 'next/link';
import { DollarSign, ExternalLink, TrendingDown, TrendingUp } from 'lucide-react';
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

// Chart strokes come from the design tokens: sage-600 and ember-500.
const SAGE = '#547344';
const EMBER = '#C87A17';

const dollars = (value: number) => `$${value.toFixed(2)}`;

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
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-clay-600">Loading financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-clay-800">
            Financials Overview
          </h1>
          <p className="mt-1 text-clay-600">
            Revenue, net income, and where the money actually went.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Deep-links to the member's own Stripe Express dashboard once
              Connect is live; until then it lands on the connect step. */}
          <Link
            href="/onboarding/payments"
            className="inline-flex items-center gap-1.5 rounded-control border border-clay-200 bg-white px-4 py-2.5 text-sm font-semibold text-clay-700 shadow-sm transition hover:border-sage-300 hover:text-clay-900"
          >
            Stripe account <ExternalLink size={14} />
          </Link>
          <Link
            href="/dashboard/financial-tools/reporting"
            className="rounded-control bg-ember-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-500"
          >
            Generate Report
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <div className="rounded-card border border-clay-200 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-ember-100 text-ember-700">
              <TrendingUp size={18} />
            </span>
            <h2 className="font-display text-lg font-semibold text-clay-800">
              Monthly Revenue
            </h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D6" />
                <XAxis dataKey="month" stroke="#7D7263" fontSize={12} />
                <YAxis stroke="#7D7263" fontSize={12} />
                <Tooltip formatter={(value) => dollars(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke={EMBER} strokeWidth={2} activeDot={{ r: 6 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Net Income Chart */}
        <div className="rounded-card border border-clay-200 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-sage-100 text-sage-700">
              <TrendingDown size={18} />
            </span>
            <h2 className="font-display text-lg font-semibold text-clay-800">
              Monthly Net Income
            </h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyNetIncomeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D6" />
                <XAxis dataKey="month" stroke="#7D7263" fontSize={12} />
                <YAxis stroke="#7D7263" fontSize={12} />
                <Tooltip formatter={(value) => dollars(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="netIncome" stroke={SAGE} strokeWidth={2} activeDot={{ r: 6 }} name="Net Income" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Income summary */}
      <div className="rounded-card border border-clay-200 bg-white p-6 shadow-card">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-control bg-sage-100 text-sage-700">
            <DollarSign size={18} />
          </span>
          <h2 className="font-display text-lg font-semibold text-clay-800">
            Current Income Summary
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
          <div className="rounded-control bg-clay-50 py-5">
            <p className="text-sm text-clay-600">Total Income</p>
            <p className="mt-1 font-display text-3xl font-bold text-clay-800">
              {dollars(incomeMinusFees.totalIncome)}
            </p>
          </div>
          <div className="rounded-control bg-clay-50 py-5">
            <p className="text-sm text-clay-600">Total Fees</p>
            <p className="mt-1 font-display text-3xl font-bold text-red-600">
              {dollars(incomeMinusFees.totalFees)}
            </p>
          </div>
          <div className="rounded-control bg-clay-50 py-5">
            <p className="text-sm text-clay-600">Net Income</p>
            <p className="mt-1 font-display text-3xl font-bold text-sage-700">
              {dollars(incomeMinusFees.netIncome)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
