"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateBusinessOwnerDetails } from "../actions"; // Assuming updateBusinessOwnerDetails action will be created
import { Business, Demographic, Location } from "@/db/schema"; // Import necessary types

export type FormState = {
  message: string;
  error: string;
} | undefined;

interface OwnerDetailsFormProps {
  business: Business & { ownerGender?: Demographic | null; ownerRace?: Demographic | null; ownerReligion?: Demographic | null; ownerRegion?: Location | null; };
  genders: Demographic[];
  races: Demographic[];
  religions: Demographic[];
  regions: Location[];
}

export default function OwnerDetailsForm({ business, genders, races, religions, regions }: OwnerDetailsFormProps) {
  const [state, formAction] = useFormState<FormState, FormData>(updateBusinessOwnerDetails, undefined);
  const [currentGenderId, setCurrentGenderId] = useState<number | null>(business.ownerGenderId || null);
  const [currentRaceId, setCurrentRaceId] = useState<number | null>(business.ownerRaceId || null);
  const [currentReligionId, setCurrentReligionId] = useState<number | null>(business.ownerReligionId || null);
  const [currentRegionId, setCurrentRegionId] = useState<number | null>(business.ownerRegionId || null);

  useEffect(() => {
    if (state?.message === "Owner details updated successfully!") {
      // Optionally, show a success message or revalidate data
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <input type="hidden" name="businessId" value={business.id} />

      {/* Gender Dropdown */}
      <div>
        <label htmlFor="ownerGenderId" className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="ownerGenderId"
          name="ownerGenderId"
          value={currentGenderId || ''}
          onChange={(e) => setCurrentGenderId(parseInt(e.target.value) || null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Gender</option>
          {genders.map((gender) => (
            <option key={gender.id} value={gender.id}>
              {gender.name}
            </option>
          ))}
        </select>
      </div>

      {/* Race Dropdown */}
      <div>
        <label htmlFor="ownerRaceId" className="block text-sm font-medium text-gray-700">
          Race
        </label>
        <select
          id="ownerRaceId"
          name="ownerRaceId"
          value={currentRaceId || ''}
          onChange={(e) => setCurrentRaceId(parseInt(e.target.value) || null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Race</option>
          {races.map((race) => (
            <option key={race.id} value={race.id}>
              {race.name}
            </option>
          ))}
        </select>
      </div>

      {/* Religion Dropdown */}
      <div>
        <label htmlFor="ownerReligionId" className="block text-sm font-medium text-gray-700">
          Religion
        </label>
        <select
          id="ownerReligionId"
          name="ownerReligionId"
          value={currentReligionId || ''}
          onChange={(e) => setCurrentReligionId(parseInt(e.target.value) || null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Religion</option>
          {religions.map((religion) => (
            <option key={religion.id} value={religion.id}>
              {religion.name}
            </option>
          ))}
        </select>
      </div>

      {/* Region Dropdown */}
      <div>
        <label htmlFor="ownerRegionId" className="block text-sm font-medium text-gray-700">
          Region
        </label>
        <select
          id="ownerRegionId"
          name="ownerRegionId"
          value={currentRegionId || ''}
          onChange={(e) => setCurrentRegionId(parseInt(e.target.value) || null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {state?.message && <p className="text-green-600 text-sm">{state.message}</p>}
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <div className="mt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Owner Details
        </button>
      </div>
    </form>
  );
}
