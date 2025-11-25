"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { submitHelpRequest } from "./actions";
import { HelpRequest, Referral } from "@/db/schema";

interface AdviceInfoMessagingClientPageProps {
  isAdmin: boolean;
  isExternal: boolean;
  currentUserId: number | null;
  initialHelpRequests: HelpRequest[];
  initialReferrals: Referral[];
}

type FormState = {
  message: string;
  error: string;
} | undefined;

export default function AdviceInfoMessagingClientPage({ isAdmin, isExternal, currentUserId, initialHelpRequests, initialReferrals }: AdviceInfoMessagingClientPageProps) {
  const [activeTab, setActiveTab] = useState("help-requests");
  const [helpRequestState, helpRequestAction] = useFormState<FormState, FormData>(submitHelpRequest, undefined);

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
              <>
                <div className="mb-8 p-6 bg-background shadow-md rounded-lg">
                  <h3 className="text-xl font-bold text-foreground mb-4">Submit a New Help Request</h3>
                  <form action={helpRequestAction} className="space-y-4">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-foreground">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      ></textarea>
                    </div>
                    {helpRequestState?.message && (
                      <p className="text-sm text-green-600 mt-2">{helpRequestState.message}</p>
                    )}
                    {helpRequestState?.error && (
                      <p className="text-sm text-red-600 mt-2">{helpRequestState.error}</p>
                    )}
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Submit Request
                    </button>
                  </form>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 mt-8">Your Previous Requests</h3>
                {initialHelpRequests.length === 0 ? (
                  <p className="text-foreground">You have not submitted any help requests yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {initialHelpRequests.map(request => (
                      <li key={request.id} className="bg-light-gray shadow overflow-hidden sm:rounded-lg p-4">
                        <p className="text-sm font-semibold">Subject: {request.subject}</p>
                        <p className="text-foreground">Status: {request.status}</p>
                        <p className="text-xs text-foreground text-right">{request.timestamp.toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="text-foreground">Internal/Admin user view for Help Requests.</p>
            )}
          </div>
        )}

        {activeTab === 'referrals' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Referrals</h2>
            {isExternal ? (
              <>
                <h3 className="text-xl font-bold text-foreground mb-4">Referrals from Admins</h3>
                {initialReferrals.length === 0 ? (
                  <p className="text-foreground">No referrals from admins yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {initialReferrals.map(referral => (
                      <li key={referral.id} className="bg-light-gray shadow overflow-hidden sm:rounded-lg p-4">
                        <p className="text-sm font-semibold">Admin Referral:</p>
                        <p className="text-foreground">{referral.content}</p>
                        <p className="text-xs text-foreground text-right">{referral.timestamp.toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="text-foreground">Internal/Admin user view for Referrals.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
