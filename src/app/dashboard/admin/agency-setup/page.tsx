"use client";

import React, { useState, useEffect } from 'react';
import { getAllBusinesses } from '@/app/dashboard/businesses/actions';
import { updateBusinessAdminFee } from '@/app/dashboard/admin/actions';
import { Business } from '@/db/schema';
import { useFormState } from 'react-dom';

const initialState = {
  message: "",
  error: "",
};

export default function AdminAgencySetUpPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const [updateFeeState, updateFeeFormAction] = useFormState(updateBusinessAdminFee, initialState);

  useEffect(() => {
    getAllBusinesses().then(businesses => {
      setBusinesses(businesses);
      setLoading(false);
    });
  }, [updateFeeState]);

  if (loading) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Admin Agency Set Up</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Admin Fees</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Fee (%)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {businesses.map(business => (
                <tr key={business.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{business.businessName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <form action={updateFeeFormAction}>
                      <input type="hidden" name="businessId" value={business.id} />
                      <div className="flex items-center">
                        <input
                          type="number"
                          name="adminFee"
                          step="0.01"
                          defaultValue={business.adminFee || ''}
                          className="w-32 p-2 border border-gray-300 rounded-md"
                        />
                        <button type="submit" className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                          Save
                        </button>
                      </div>
                    </form>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {updateFeeState?.message && <p className="text-green-600">{updateFeeState.message}</p>}
                    {updateFeeState?.error && <p className="text-red-600">{updateFeeState.error}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
