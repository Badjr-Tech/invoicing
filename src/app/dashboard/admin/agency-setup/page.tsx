"use client";

import React, { useState, useEffect } from 'react';
import { getPlatformAdminFee, updatePlatformAdminFee } from '@/app/dashboard/admin/actions';
import { useFormState } from 'react-dom';

const initialState = {
  message: "",
  error: "",
};

export default function AdminAgencySetUpPage() {
  const [adminFee, setAdminFee] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [updateFeeState, updateFeeFormAction] = useFormState(updatePlatformAdminFee, initialState);

  useEffect(() => {
    getPlatformAdminFee().then(fee => {
      setAdminFee(fee);
      setLoading(false);
    });
  }, [updateFeeState]);

  if (loading) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Admin Agency Set Up</h1>

      <div className="flex space-x-4 mb-6">
        <Link href="/dashboard/admin/agency-setup/checklist-management" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Checklist Management
        </Link>
        <button className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Placeholder Button 1
        </button>
        <button className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Placeholder Button 2
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Admin Fee</h2>
        <form action={updateFeeFormAction} className="space-y-4">
          <div>
            <label htmlFor="adminFee" className="block text-sm font-medium text-gray-700">Admin Fee (%)</label>
            <input
              type="number"
              id="adminFee"
              name="adminFee"
              step="0.01"
              defaultValue={adminFee}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Save Admin Fee
          </button>
          {updateFeeState?.message && <p className="text-green-600 mt-2">{updateFeeState.message}</p>}
          {updateFeeState?.error && <p className="text-red-600 mt-2">{updateFeeState.error}</p>}
        </form>
      </div>
    </div>
  );
}
