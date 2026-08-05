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
      <h1 className="font-display text-2xl font-semibold text-clay-800 mb-6">Admin Agency Set Up</h1>

      <div className="flex space-x-4 mb-6">
        <Link href="/dashboard/admin/agency-setup/checklist-management" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-control text-white bg-sage-600 hover:bg-sage-700-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300">
          Checklist Management
        </Link>
        <button className="inline-flex justify-center py-2 px-4 border border-clay-200 shadow-sm text-sm font-medium rounded-control text-clay-700 bg-white hover:bg-clay-50">
          Placeholder Button 1
        </button>
        <button className="inline-flex justify-center py-2 px-4 border border-clay-200 shadow-sm text-sm font-medium rounded-control text-clay-700 bg-white hover:bg-clay-50">
          Placeholder Button 2
        </button>
      </div>

      <div className="bg-white p-6 rounded-card shadow-card">
        <h2 className="font-display text-xl font-semibold text-clay-800 mb-4">Platform Admin Fee</h2>
        <form action={updateFeeFormAction} className="space-y-4">
          <div>
            <label htmlFor="adminFee" className="block text-sm font-medium text-clay-700">Admin Fee (%)</label>
            <input
              type="number"
              id="adminFee"
              name="adminFee"
              step="0.01"
              defaultValue={adminFee}
              required
              className="mt-1 block w-full rounded-control border-clay-200 shadow-sm focus:border-sage-400 focus:ring-sage-300"
            />
          </div>
          <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-control text-white bg-sage-600 hover:bg-sage-700-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300">
            Save Admin Fee
          </button>
          {updateFeeState?.message && <p className="text-sage-700 mt-2">{updateFeeState.message}</p>}
          {updateFeeState?.error && <p className="text-red-600 mt-2">{updateFeeState.error}</p>}
        </form>
      </div>
    </div>
  );
}
