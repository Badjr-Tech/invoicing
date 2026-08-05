"use client";

import { useFormState } from "react-dom";
import { createDba } from "./actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllUserBusinesses } from "../actions"; // To fetch businesses for dropdown
import { SessionPayload, fetchSession } from "@/app/login/actions"; // To get user ID

interface Business {
  id: number;
  businessName: string;
}

type FormState = {
  message: string;
  error: string;
} | undefined;

export default function CreateDbaPage() {
  const [state, formAction] = useFormState(createDba, undefined);
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionPayload | null>(null);

  useEffect(() => {
    async function loadBusinesses() {
      setLoading(true);
      const currentSession = await fetchSession();
      setSession(currentSession);

      if (currentSession && currentSession.user) {
        const userBusinesses = await getAllUserBusinesses(currentSession.user.id);
        setBusinesses(userBusinesses);
      }
      setLoading(false);
    }
    loadBusinesses();
  }, []);

  useEffect(() => {
    if (state?.message === "DBA created successfully!") {
      router.push("/dashboard/businesses"); // Redirect back to businesses page
    }
  }, [state, router]);

  if (loading) {
    return <div className="min-h-screen bg-clay-100 p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-clay-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-card shadow-card">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl font-semibold text-clay-800">Create New DBA</h1>
          <Link href="/dashboard/businesses" className="px-4 py-2 bg-gray-200 text-clay-800 rounded-control hover:bg-gray-300">
            Back to Businesses
          </Link>
        </div>

        {state?.message && (
          <div className="mb-4 p-3 rounded-control bg-sage-100 text-sage-800">
            {state.message}
          </div>
        )}
        {state?.error && (
          <div className="mb-4 p-3 rounded-control bg-red-100 text-red-800">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* DBA Name */}
          <div>
            <label htmlFor="dbaName" className="block text-sm font-medium text-clay-700">
              DBA Name
            </label>
            <input
              type="text"
              id="dbaName"
              name="dbaName"
              required
              className="mt-1 block w-full border border-clay-200 rounded-control shadow-sm p-2 focus:ring-sage-300 focus:border-sage-400"
            />
          </div>

          {/* Business Name (Dropdown) */}
          <div>
            <label htmlFor="businessId" className="block text-sm font-medium text-clay-700">
              Associated Business
            </label>
            <select
              id="businessId"
              name="businessId"
              required
              className="mt-1 block w-full border border-clay-200 rounded-control shadow-sm p-2 focus:ring-sage-300 focus:border-sage-400"
            >
              <option value="">Select a Business</option>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.businessName}
                </option>
              ))}
            </select>
          </div>

          {/* Business Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-clay-700">
              DBA Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full border border-clay-200 rounded-control shadow-sm p-2 focus:ring-sage-300 focus:border-sage-400"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-control shadow-sm text-sm font-medium text-white bg-ember-600 hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-300"
          >
            Create DBA
          </button>
        </form>
      </div>
    </div>
  );
}
