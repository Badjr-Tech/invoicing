"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { createBusinessProfile, getAllUserBusinesses, createDBA } from "./actions";
import { SessionPayload, fetchSession } from "@/app/login/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormState = {
  message: string;
  error: string;
} | undefined;

interface Dba {
  id: number;
  name: string;
  businessId: number;
}

interface Business {
  id: number;
  userId: number;
  businessName: string;
  ownerName: string;
  percentOwnership: string;
  businessType: string;
  businessTaxStatus: string;
  businessDescription: string | null;
  businessIndustry: string;
  businessMaterialsUrl: string | null;
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  phone: string | null;
  website: string | null;
  isArchived: boolean;
  logoUrl: string | null;
  dbas: Dba[];
  color1: string | null;
  color2: string | null;
  color3: string | null;
  color4: string | null;
}

export default function YourBusinessesPageContent() {
  const router = useRouter();
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
  const [allDbas, setAllDbas] = useState<Dba[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDbaForm, setShowDbaForm] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  const [createState, createFormAction] = useFormState<FormState, FormData>(createBusinessProfile, undefined);
  const [createDbaState, createDbaFormAction] = useFormState<FormState, FormData>(createDBA, undefined);

  useEffect(() => {
    async function fetchSessionAndBusinesses() {
      setLoadingBusinesses(true);
      const currentSession = await fetchSession();
      setSession(currentSession);

      if (currentSession && currentSession.user) {
        const businesses = await getAllUserBusinesses(currentSession.user.id);
        setUserBusinesses(businesses);
        const dbas = businesses.flatMap((business) => business.dbas);
        setAllDbas(dbas);
      }
      setLoadingBusinesses(false);
    }
    fetchSessionAndBusinesses();
  }, [createState]);

  useEffect(() => {
    if (createState && createState.message && !createState.error) {
      setShowCreateForm(false);
      router.push("/dashboard/businesses");
    }
  }, [createState, router]);

  useEffect(() => {
    if (createDbaState && createDbaState.message && !createDbaState.error) {
      setShowDbaForm(false);
      // Refresh the business list
      async function fetchBusinesses() {
        if (session && session.user) {
          const businesses = await getAllUserBusinesses(session.user.id);
          setUserBusinesses(businesses);
          const dbas = businesses.flatMap((business) => business.dbas);
          setAllDbas(dbas);
        }
      }
      fetchBusinesses();
    }
  }, [createDbaState, session]);

  if (!session || !session.user) {
    return <div className="flex-1 p-6">Loading user session...</div>;
  }

  const handleBusinessClick = (businessId: number) => {
    router.push(`/dashboard/businesses/${businessId}`);
  };

  const handleDbaClick = (dbaId: number) => {
    router.push(`/dashboard/businesses/dba/${dbaId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Businesses</h1>
        <p className="mt-4 text-foreground">Manage all your registered businesses.</p>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {showCreateForm ? "Cancel" : "Create New Business"}
          </button>
          <button
            onClick={() => setShowDbaForm(!showDbaForm)}
            className="inline-flex justify-center rounded-md border border-transparent bg-secondary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            {showDbaForm ? "Cancel" : "Add DBA"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mt-8 max-w-2xl p-6 bg-background shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Create New Business Profile</h2>
            <form action={createFormAction} className="space-y-6">
              {/* Form fields for creating a new business */}
            </form>
          </div>
        )}

        {showDbaForm && (
          <div className="mt-8 max-w-2xl p-6 bg-background shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">Add DBA</h2>
            <form action={createDbaFormAction} className="space-y-6">
              <div>
                <label htmlFor="businessId" className="block text-sm font-medium text-foreground">
                  Select Business
                </label>
                <select
                  id="businessId"
                  name="businessId"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-foreground"
                >
                  <option value="">Select a business</option>
                  {userBusinesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.businessName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dbaName" className="block text-sm font-medium text-foreground">
                  DBA Name
                </label>
                <input
                  id="dbaName"
                  name="dbaName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-foreground"
                />
              </div>
              {createDbaState?.message && (
                <p className="text-sm text-green-600">{createDbaState.message}</p>
              )}
              {createDbaState?.error && (
                <p className="text-sm text-red-600">{createDbaState.error}</p>
              )}
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Add DBA
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Display existing businesses */}
        <div className="mt-8 flex flex-col space-y-4">
          {userBusinesses.length === 0 && !showCreateForm ? (
            <p className="text-foreground">You don&apos;t have any businesses yet. Click &quot;Create New Business&quot; to get started!</p>
          ) : (
            userBusinesses.map((business) => (
              <button
                key={business.id}
                onClick={() => handleBusinessClick(business.id)}
                className={`w-full text-left py-4 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center space-x-4 ${business.isArchived ? 'bg-gray-200 text-gray-500 opacity-60' : 'bg-background hover:shadow-lg'}`}
              >
                {business.logoUrl ? (
                  <Image src={business.logoUrl} alt={`${business.businessName} Logo`} width={40} height={40} className="rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-bold">
                    {business.businessName ? business.businessName[0].toUpperCase() : '?'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{business.businessName}</h3>
                  <p className="mt-2 text-sm text-white">Owner: {business.ownerName}</p>
                  <p className="text-sm text-white">Type: {business.businessType}</p>
                  {business.isArchived && (
                    <p className="mt-2 text-sm font-semibold text-red-600">Archived</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Display existing businesses */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Your DBAs</h2>
        <div className="mt-8 flex flex-col space-y-4">
          {allDbas.length === 0 ? (
            <p className="text-foreground">You don&apos;t have any DBAs yet.</p>
          ) : (
            allDbas.map((dba) => {
              const parentBusiness = userBusinesses.find(b => b.id === dba.businessId);
              const bgColor = parentBusiness?.color1 || 'bg-background';
              return (
                <button key={dba.id} onClick={() => handleDbaClick(dba.id)} className={`p-4 rounded-lg shadow-md w-full text-left`} style={{ backgroundColor: bgColor }}>
                  <h3 className="text-xl font-bold text-white">{dba.name}</h3>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
