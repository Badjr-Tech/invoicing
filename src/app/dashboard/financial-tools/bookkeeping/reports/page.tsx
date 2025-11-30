"use client";

import React, { useState } from 'react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('profit-and-loss');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerateReport = () => {
    // This is where you would fetch the data and generate the report.
    // For now, we will just log the report type and date range.
    console.log({
      reportType,
      startDate,
      endDate,
    });
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Reports</h1>

      <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate Report</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Report Type</label>
            <select id="reportType" name="reportType" value={reportType} onChange={e => setReportType(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="profit-and-loss">Profit and Loss</option>
              <option value="income-statement">Income Statement</option>
              <option value="expense-report">Expense Report</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" id="startDate" name="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" id="endDate" name="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="flex items-center">
            <button onClick={handleGenerateReport} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
