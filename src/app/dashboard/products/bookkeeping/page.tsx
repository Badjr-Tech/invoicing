"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { getSession } from '@/app/login/actions';
import { getAllUserBusinesses } from '@/app/dashboard/businesses/actions';
import { getTransactions, addTransaction } from './actions';
import { Business, Service, transactions } from '@/db/schema';
import { useFormState } from 'react-dom';

type Transaction = typeof transactions.$inferSelect;

const initialState = {
  message: "",
  error: "",
};

export default function BookkeepingProductPage() {
  const [session, setSession] = useState<any>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [addTransactionState, addTransactionFormAction] = useFormState(addTransaction, initialState);

  useEffect(() => {
    async function fetchData() {
      const userSession = await getSession();
      setSession(userSession);

      if (userSession?.user?.id) {
        const userBusinesses = await getAllUserBusinesses(userSession.user.id);
        setBusinesses(userBusinesses);
        if (userBusinesses.length > 0) {
          setSelectedBusinessId(userBusinesses[0].id);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      getTransactions(selectedBusinessId).then(setTransactions);
      // Here you would also fetch the services for the selected business
      // For now, we will use a placeholder
      setServices([]);
    }
  }, [selectedBusinessId, addTransactionState]);

  const { income, expenses, profit } = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const profit = income - expenses;
    return { income, expenses, profit };
  }, [transactions]);

  if (loading) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Bookkeeping</h1>
        <select
          value={selectedBusinessId || ''}
          onChange={(e) => setSelectedBusinessId(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-md"
        >
          {businesses.map(business => (
            <option key={business.id} value={business.id}>
              {business.businessName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-6 bg-green-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-green-800">Total Income</h2>
          <p className="text-3xl font-bold text-green-600">${income.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-red-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-800">Total Expenses</h2>
          <p className="text-3xl font-bold text-red-600">${expenses.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-blue-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-800">Profit</h2>
          <p className="text-3xl font-bold text-blue-600">${profit.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Income</h2>
          <form action={addTransactionFormAction} className="space-y-4">
            <input type="hidden" name="businessId" value={selectedBusinessId || ''} />
            <input type="hidden" name="type" value="income" />
            <div>
              <label htmlFor="income-service" className="block text-sm font-medium text-gray-700">Service</label>
              <select id="income-service" name="serviceId" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="income-description" className="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" id="income-description" name="description" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="income-amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" id="income-amount" name="amount" step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="income-date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="income-date" name="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="income-notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea id="income-notes" name="notes" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
            </div>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Add Income</button>
            {addTransactionState?.message && <p className="text-green-600 mt-2">{addTransactionState.message}</p>}
            {addTransactionState?.error && <p className="text-red-600 mt-2">{addTransactionState.error}</p>}
          </form>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Expense</h2>
          <form action={addTransactionFormAction} className="space-y-4">
            <input type="hidden" name="businessId" value={selectedBusinessId || ''} />
            <input type="hidden" name="type" value="expense" />
            <div>
              <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" id="expense-description" name="description" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700">Amount</label>
              <input type="number" id="expense-amount" name="amount" step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="expense-date" name="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="expense-notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea id="expense-notes" name="notes" rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
            </div>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Add Expense</button>
            {addTransactionState?.message && <p className="text-green-600 mt-2">{addTransactionState.message}</p>}
            {addTransactionState?.error && <p className="text-red-600 mt-2">{addTransactionState.error}</p>}
          </form>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.notes}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{transaction.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${parseFloat(transaction.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
