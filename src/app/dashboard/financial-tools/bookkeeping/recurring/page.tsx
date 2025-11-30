"use client";

import React, { useState, useEffect } from 'react';
import { getRecurringTransactions, createRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction } from './actions';
import { getTransactionCategories } from '../categories/actions';
import { useFormState } from 'react-dom';

type RecurringTransaction = {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: number | null;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date | null;
  isConfirmed: boolean;
};

type TransactionCategory = {
  id: number;
  name: string;
  type: 'income' | 'expense';
};

const initialState = {
  message: "",
  error: "",
};

export default function RecurringTransactionsPage() {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null);

  const [createState, createAction] = useFormState(createRecurringTransaction, initialState);
  const [updateState, updateAction] = useFormState(updateRecurringTransaction, initialState);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getRecurringTransactions(),
      getTransactionCategories(),
    ]).then(([transactions, categories]) => {
      setRecurringTransactions(transactions);
      setCategories(categories);
      setLoading(false);
    });
  }, [createState, updateState]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this recurring transaction?")) {
      await deleteRecurringTransaction(id);
      setRecurringTransactions(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Recurring Transactions</h1>

      <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editingTransaction ? 'Edit' : 'Create'} Recurring Transaction
        </h2>
        <form action={editingTransaction ? updateAction : createAction} className="space-y-4">
          {editingTransaction && <input type="hidden" name="id" value={editingTransaction.id} />}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" id="description" name="description" defaultValue={editingTransaction?.description || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" id="amount" name="amount" defaultValue={editingTransaction?.amount || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select id="type" name="type" defaultValue={editingTransaction?.type || 'expense'} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="categoryId" name="categoryId" defaultValue={editingTransaction?.categoryId || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
            <select id="frequency" name="frequency" defaultValue={editingTransaction?.frequency || 'monthly'} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" id="startDate" name="startDate" defaultValue={editingTransaction?.startDate ? new Date(editingTransaction.startDate).toISOString().split('T')[0] : ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date (optional)</label>
            <input type="date" id="endDate" name="endDate" defaultValue={editingTransaction?.endDate ? new Date(editingTransaction.endDate).toISOString().split('T')[0] : ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="flex items-center">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
              {editingTransaction ? 'Update' : 'Create'}
            </button>
            {editingTransaction && (
              <button type="button" onClick={() => setEditingTransaction(null)} className="ml-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
            )}
          </div>
          {(createState?.message || updateState?.message) && <p className="text-green-600 mt-2">{createState?.message || updateState?.message}</p>}
          {(createState?.error || updateState?.error) && <p className="text-red-600 mt-2">{createState?.error || updateState?.error}</p>}
        </form>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recurring Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recurringTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.frequency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => setEditingTransaction(transaction)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button onClick={() => handleDelete(transaction.id)} className="ml-4 text-red-600 hover:text-red-900">Delete</button>
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
