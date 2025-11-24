"use client";

import { useState } from "react";

interface AdviceInfoMessagingClientPageProps {
  isAdmin: boolean;
  isExternal: boolean;
  currentUserId: number | null;
}

export default function AdviceInfoMessagingClientPage({ isAdmin, isExternal, currentUserId }: AdviceInfoMessagingClientPageProps) {
  const [activeTab, setActiveTab] = useState("help-requests");

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Advice & Info Messaging</h1>
      </div>
      <div className="mt-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-primary focus:border-primary border-light-gray rounded-md"
            defaultValue={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="help-requests">Help Requests</option>
            <option value="referrals">Referrals</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('help-requests')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'help-requests' ? 'bg-secondary text-foreground' : 'bg-light-gray text-foreground'}`}
            >
              Help Requests
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'referrals' ? 'bg-secondary text-foreground' : 'bg-light-gray text-foreground'}`}
            >
              Referrals
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'help-requests' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Help Requests</h2>
            {isExternal ? (
              <p className="text-foreground">External user view for Help Requests.</p>
            ) : (
              <p className="text-foreground">Internal/Admin user view for Help Requests.</p>
            )}
          </div>
        )}

        {activeTab === 'referrals' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Referrals</h2>
            {isExternal ? (
              <p className="text-foreground">External user view for Referrals.</p>
            ) : (
              <p className="text-foreground">Internal/Admin user view for Referrals.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
