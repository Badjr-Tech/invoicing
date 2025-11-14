'use client';

import { useEffect, useState } from 'react';
import { populateDemographics } from './actions';

export default function PopulateDemographicsPage() {
  const [status, setStatus] = useState('Idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const runPopulation = async () => {
      setStatus('Populating...');
      const result = await populateDemographics();
      if (result.success) {
        setStatus('Completed');
        setMessage(result.message);
      } else {
        setStatus('Failed');
        setMessage(result.message);
      }
    };

    runPopulation();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Populate Demographics</h1>
      <p>Status: {status}</p>
      {message && <p>Message: {message}</p>}
      <p className="mt-4 text-sm text-gray-500">
        This page will automatically populate the demographics table. Please close this tab after completion.
      </p>
    </div>
  );
}
