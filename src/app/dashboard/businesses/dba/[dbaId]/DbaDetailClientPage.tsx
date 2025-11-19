"use client";

import { useState } from "react";
import { Dba } from "@/db/schema";
import DbaDetailsForm from "./DbaDetailsForm";
import DbaDesignForm from "./DbaDesignForm";
import DbaUploadsForm from "./DbaUploadsForm";

export default function DbaDetailClientPage({ initialDba }: { initialDba: Dba }) {
  const [activeTab, setActiveTab] = useState('details');
  const [dba, setDba] = useState(initialDba);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground">{dba.name}</h1>
      <div className="border-b border-gray-200 mt-4">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('details')}
            className={`${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`${activeTab === 'design' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('uploads')}
            className={`${activeTab === 'uploads' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Uploads
          </button>
        </nav>
      </div>

      {activeTab === 'details' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">DBA Details</h2>
          <DbaDetailsForm dba={dba} />
        </div>
      )}

      {activeTab === 'design' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">DBA Design</h2>
          <DbaDesignForm dba={dba} />
        </div>
      )}

      {activeTab === 'uploads' && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">DBA Uploads</h2>
          <DbaUploadsForm dba={dba} />
        </div>
      )}
    </div>
  );
}
