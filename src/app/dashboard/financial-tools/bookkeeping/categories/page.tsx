"use client";

import React, { useState, useEffect } from 'react';
import { getTransactionCategories, createTransactionCategory, updateTransactionCategory, deleteTransactionCategory } from './actions';
import { useFormState } from 'react-dom';

type TransactionCategory = {
  id: number;
  name: string;
  type: 'income' | 'expense';
};

const initialState = {
  message: "",
  error: "",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<TransactionCategory | null>(null);

  const [createState, createAction] = useFormState(createTransactionCategory, initialState);
  const [updateState, updateAction] = useFormState(updateTransactionCategory, initialState);

  useEffect(() => {
    setLoading(true);
    getTransactionCategories().then(items => {
      setCategories(items);
      setLoading(false);
    });
  }, [createState, updateState]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteTransactionCategory(id);
      setCategories(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Transaction Categories</h1>

      <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editingCategory ? 'Edit' : 'Create'} Category
        </h2>
        <form action={editingCategory ? updateAction : createAction} className="space-y-4">
          {editingCategory && <input type="hidden" name="id" value={editingCategory.id} />}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" name="name" defaultValue={editingCategory?.name || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select id="type" name="type" defaultValue={editingCategory?.type || 'expense'} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex items-center">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
              {editingCategory ? 'Update' : 'Create'}
            </button>
            {editingCategory && (
              <button type="button" onClick={() => setEditingCategory(null)} className="ml-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map(category => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => setEditingCategory(category)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button onClick={() => handleDelete(category.id)} className="ml-4 text-red-600 hover:text-red-900">Delete</button>
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
