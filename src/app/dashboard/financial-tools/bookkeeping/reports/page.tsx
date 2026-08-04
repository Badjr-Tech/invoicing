"use client";

import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('profit-and-loss');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPdf, setShowPdf] = useState(false);

  const handleGenerateReport = () => {
    // This is where you would fetch the data and generate the report.
    // For now, we will just log the report type and date range.
    console.log({
      reportType,
      startDate,
      endDate,
    });
    setShowPdf(true);
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="font-display text-2xl font-semibold text-foreground mb-6">Reports</h1>

      <div className="mb-8 p-6 bg-white shadow-card rounded-card">
        <h2 className="font-display text-xl font-semibold text-clay-800 mb-4">Generate Report</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-clay-700">Report Type</label>
            <select id="reportType" name="reportType" value={reportType} onChange={e => setReportType(e.target.value)} required className="mt-1 block w-full rounded-control border-clay-200 shadow-sm">
              <option value="profit-and-loss">Profit and Loss</option>
              <option value="income-statement">Income Statement</option>
              <option value="expense-report">Expense Report</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-clay-700">Start Date</label>
            <input type="date" id="startDate" name="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-control border-clay-200 shadow-sm" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-clay-700">End Date</label>
            <input type="date" id="endDate" name="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full rounded-control border-clay-200 shadow-sm" />
          </div>
          <div className="flex items-center">
            <button onClick={handleGenerateReport} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-control text-white bg-primary hover:bg-primary-dark">
              Generate Report
            </button>
            {showPdf && (
              <PDFDownloadLink document={<ReportPDF />} fileName="report.pdf">
                {({ blob, url, loading, error }) =>
                  loading ? 'Loading document...' : 'Download PDF'
                }
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
