"use client";

import { useFormState } from "react-dom";
import { createBusinessProfile } from "../actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateBusinessPage() {
  const [state, formAction] = useFormState(createBusinessProfile, undefined);
  const router = useRouter();
  const [dbas, setDbas] = useState<string[]>([]);
  const [newDba, setNewDba] = useState("");

  useEffect(() => {
    if (state?.message === "Business profile created successfully!") {
      router.push("/dashboard/businesses");
    }
  }, [state, router]);

  const handleAddDba = () => {
    console.log("handleAddDba called");
    if (newDba.trim() !== "") {
      setDbas((prevDbas) => {
        const updatedDbas = [...prevDbas, newDba.trim()];
        console.log("DBAs after add:", updatedDbas);
        return updatedDbas;
      });
      setNewDba("");
      console.log("newDba cleared");
    } else {
      console.log("newDba is empty, not adding.");
    }
  };

  const handleDeleteDba = (index: number) => {
    const updatedDbas = [...dbas];
    updatedDbas.splice(index, 1);
    setDbas(updatedDbas);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create New Business Profile</h1>
          <Link href="/dashboard/businesses" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Back to Businesses
          </Link>
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

        <form action={formAction} className="space-y-6">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business Name (Legal Name)
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              required
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Tax Status</option>
              <option value="S-Corporation">S-Corporation</option>
              <option value="C-Corporation">C-Corporation</option>
              <option value="Not Applicable">Not Applicable</option>
            </select>
          </div>

          {/* DBA Management */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Doing Business As (DBA)</h2>
            <div className="space-y-4">
              {dbas.map((dba, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                  <p>{dba}</p>
                  <button
                    type="button"
                    onClick={() => handleDeleteDba(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={newDba}
                onChange={(e) => setNewDba(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDba(); // Call handleAddDba when Enter is pressed
                  }
                }}
                placeholder="Enter DBA name"
                className="flex-grow border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddDba}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add DBA
              </button>
            </div>
          </div>

          <input type="hidden" name="dbas" value={JSON.stringify(dbas)} />

          {/* Business Description */}
          <div>
            <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
              Business Description (Optional)
            </label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              rows={3}
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Business Profile
          </button>
        </form>
      </div>
    </div>
  );
}