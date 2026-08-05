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
      <h1 className="font-display text-2xl font-semibold text-clay-800">{dba.name}</h1>
      <div className="border-b border-clay-200 mt-4">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('details')}
            className={`${activeTab === 'details' ? 'border-sage-400 text-sage-700' : 'border-transparent text-clay-500 hover:text-clay-700 hover:border-clay-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`${activeTab === 'design' ? 'border-sage-400 text-sage-700' : 'border-transparent text-clay-500 hover:text-clay-700 hover:border-clay-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('uploads')}
            className={`${activeTab === 'uploads' ? 'border-sage-400 text-sage-700' : 'border-transparent text-clay-500 hover:text-clay-700 hover:border-clay-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Uploads
          </button>
        </nav>
      </div>

      {activeTab === 'details' && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold text-clay-800 mb-4">DBA Details</h2>
          <DbaDetailsForm dba={dba} />
        </div>
      )}

      {activeTab === 'design' && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold text-clay-800 mb-4">DBA Design</h2>
          <DbaDesignForm dba={dba} />
        </div>
      )}

      {activeTab === 'uploads' && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold text-clay-800 mb-4">DBA Uploads</h2>
          <DbaUploadsForm dba={dba} />
        </div>
      )}
    </div>
  );
}
