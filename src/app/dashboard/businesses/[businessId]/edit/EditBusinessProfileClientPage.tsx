"use client";

import { useState, useEffect } from "react";
import { Business } from "@/db/schema"; // Assuming Business type is available
import Link from "next/link";
import { useFormState } from "react-dom";
import { updateBusinessProfile } from "../../../businesses/actions"; // Adjust path as needed
import { useRouter } from "next/navigation";

interface EditBusinessProfileClientPageProps {
  initialBusiness: Business;
}

export default function EditBusinessProfileClientPage({ initialBusiness }: EditBusinessProfileClientPageProps) {
  const [activeTab, setActiveTab] = useState("info"); // 'info', 'materials', 'branding', 'edit'
  const [state, formAction] = useFormState(updateBusinessProfile, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.message === "Business profile updated successfully!") {
      // Optionally, show a toast notification or similar before redirecting
      router.push(`/dashboard/businesses/${initialBusiness.id}`);
    }
  }, [state, router, initialBusiness.id]);

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold text-foreground">Edit Business: {initialBusiness.businessName}</h1>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <TabButton tabName="info" activeTab={activeTab} setActiveTab={setActiveTab}>Business Info</TabButton>
          <TabButton tabName="materials" activeTab={activeTab} setActiveTab={setActiveTab}>Business Materials</TabButton>
          <TabButton tabName="branding" activeTab={activeTab} setActiveTab={setActiveTab}>Branding</TabButton>
          {/* <TabButton tabName="edit" activeTab={activeTab} setActiveTab={setActiveTab}>General Edit</TabButton> */}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "info" && (
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="businessId" value={initialBusiness.id} />

            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name/Title
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                required
                defaultValue={initialBusiness.businessName}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Legal Business Name */}
            <div>
              <label htmlFor="legalBusinessName" className="block text-sm font-medium text-gray-700">
                Legal Business Name
              </label>
              <input
                type="text"
                id="legalBusinessName"
                name="legalBusinessName"
                defaultValue={initialBusiness.legalBusinessName || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Tax Full Name */}
            <div>
              <label htmlFor="taxFullName" className="block text-sm font-medium text-gray-700">
                Your Full Name for Tax Reasons (e.g., for Sole Proprietorships)
              </label>
              <input
                type="text"
                id="taxFullName"
                name="taxFullName"
                defaultValue={initialBusiness.taxFullName || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                required
                defaultValue={initialBusiness.ownerName}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Percent Ownership */}
            <div>
              <label htmlFor="percentOwnership" className="block text-sm font-medium text-gray-700">
                Percent Ownership
              </label>
              <input
                type="number"
                id="percentOwnership"
                name="percentOwnership"
                required
                min="0"
                max="100"
                step="0.01"
                defaultValue={parseFloat(initialBusiness.percentOwnership)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Business Type */}
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                Business Type
              </label>
              <select
                id="businessType"
                name="businessType"
                required
                defaultValue={initialBusiness.businessType}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Business Type</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
                <option value="Corporation">Corporation</option>
              </select>
            </div>

            {/* Business Tax Status */}
            <div>
              <label htmlFor="businessTaxStatus" className="block text-sm font-medium text-gray-700">
                Business Tax Status
              </label>
              <select
                id="businessTaxStatus"
                name="businessTaxStatus"
                required
                defaultValue={initialBusiness.businessTaxStatus}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Tax Status</option>
                <option value="S-Corporation">S-Corporation</option>
                <option value="C-Corporation">C-Corporation</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>

            {/* Business Industry */}
            <div>
              <label htmlFor="businessIndustry" className="block text-sm font-medium text-gray-700">
                Business Industry
              </label>
              <input
                type="text"
                id="businessIndustry"
                name="businessIndustry"
                required
                defaultValue={initialBusiness.businessIndustry}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* NAICS Code */}
            <div>
              <label htmlFor="naicsCode" className="block text-sm font-medium text-gray-700">
                NAICS Code (Optional)
              </label>
              <input
                type="text"
                id="naicsCode"
                name="naicsCode"
                defaultValue={initialBusiness.naicsCode || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Business Description */}
            <div>
              <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
                Business Description (Optional)
              </label>
              <textarea
                id="businessDescription"
                name="businessDescription"
                rows={3}
                defaultValue={initialBusiness.businessDescription || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>

            {/* Contact Information */}
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Contact Information</h2>
            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                defaultValue={initialBusiness.streetAddress || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                defaultValue={initialBusiness.city || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  maxLength={2}
                  defaultValue={initialBusiness.state || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  maxLength={10}
                  defaultValue={initialBusiness.zipCode || ''}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={initialBusiness.phone || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                defaultValue={initialBusiness.website || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {state?.message && (
              <div className="mb-4 p-3 rounded-md bg-green-100 text-green-800">
                {state.message}
              </div>
            )}
            {state?.error && (
              <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800">
                {state.error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Business Profile
            </button>
          </form>
        )}
        {activeTab === "materials" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Business Materials</h2>
            {/* Placeholder for business materials management */}
            <p>Business materials management will go here.</p>
          </div>
        )}
        {activeTab === "branding" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Branding</h2>
            {/* Placeholder for branding elements */}
            <p>Branding elements (logo, colors, etc.) will go here.</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href={`/dashboard/businesses/${initialBusiness.id}`}>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-background py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to Business Details
          </button>
        </Link>
      </div>
    </div>
  );
}

interface TabButtonProps {
  tabName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

function TabButton({ tabName, activeTab, setActiveTab, children }: TabButtonProps) {
  const isActive = activeTab === tabName;
  return (
    <button
      type="button"
      onClick={() => setActiveTab(tabName)}
      className={`${
        isActive
          ? "border-indigo-500 text-indigo-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
    >
      {children}
    </button>
  );
}