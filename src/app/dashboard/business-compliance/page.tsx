import React from 'react';
import ComplianceChecklist from './ComplianceChecklist';

export default function BusinessCompliancePage() {
  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground">Business Compliance</h1>
      <p className="mt-4 text-muted-foreground">
        This page will contain information and tools related to business compliance.
      </p>

      {/* New container for introductory paragraph */}
      <div className="mt-8 p-6 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-lg shadow-md">
        <p className="text-lg">
          A strong, compliant business starts with a few essential foundations. These aren’t complicated, but they make all the difference in keeping your operations organized, professional, and ready to grow. The checklist below covers the core items every business should have in place—from legal setup and banking to pricing, cash flow, and basic systems. Completing these steps ensures your business is structured, credible, and prepared for long-term success.
        </p>
      </div>

      <ComplianceChecklist />
    </div>
  );
}
