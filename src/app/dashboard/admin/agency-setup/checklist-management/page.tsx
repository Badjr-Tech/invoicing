"use client";

import React, { useState, useEffect } from 'react';
import { getAdminChecklistItems, createAdminChecklistItem, updateAdminChecklistItem, deleteAdminChecklistItem } from './actions';
import { useFormState } from 'react-dom';

type ChecklistItem = {
  id: number;
  itemId: string;
  category: string;
  title: string;
  description: string | null;
  link: string | null;
};

const initialState = {
  message: "",
  error: "",
};

export default function ChecklistManagementPage() {
  const [activeTab, setActiveTab] = useState('business-compliance');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);

  const [createState, createAction] = useFormState(createAdminChecklistItem, initialState);
  const [updateState, updateAction] = useFormState(updateAdminChecklistItem, initialState);

  useEffect(() => {
    setLoading(true);
    getAdminChecklistItems(activeTab).then(items => {
      setChecklistItems(items);
      setLoading(false);
    });
  }, [activeTab, createState, updateState]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteAdminChecklistItem(id);
      setChecklistItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Checklist Management</h1>

      <div className="flex border-b">
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'business-compliance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('business-compliance')}
        >
          Business Compliance
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'scaling-your-business' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('scaling-your-business')}
        >
          Scaling Your Business
        </button>
      </div>

      <div className="mt-8">
        <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {editingItem ? 'Edit' : 'Create'} Checklist Item for {activeTab === 'business-compliance' ? 'Business Compliance' : 'Scaling Your Business'}
          </h2>
          <form action={editingItem ? updateAction : createAction} className="space-y-4">
            <input type="hidden" name="category" value={activeTab} />
            {editingItem && <input type="hidden" name="id" value={editingItem.id} />}
            <div>
              <label htmlFor="itemId" className="block text-sm font-medium text-gray-700">Item ID</label>
              <input type="text" id="itemId" name="itemId" defaultValue={editingItem?.itemId || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" name="title" defaultValue={editingItem?.title || ''} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" name="description" defaultValue={editingItem?.description || ''} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            </div>
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link</label>
              <input type="text" id="link" name="link" defaultValue={editingItem?.link || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div className="flex items-center">
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                {editingItem ? 'Update' : 'Create'}
              </button>
              {editingItem && (
                <button type="button" onClick={() => setEditingItem(null)} className="ml-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeTab === 'business-compliance' ? 'Business Compliance' : 'Scaling Your Business'} Checklist</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {checklistItems.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.itemId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => setEditingItem(item)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="ml-4 text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
