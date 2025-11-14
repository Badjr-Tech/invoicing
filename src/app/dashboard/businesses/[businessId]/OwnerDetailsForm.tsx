"use client";

import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { updateBusinessOwnerDetails } from "../actions";
import { Business, DemographicType, LocationType } from "@/db/schema";

export type FormState = {
  message: string;
  error: string;
} | undefined;

interface OwnerDetailsFormProps {
  business: Business & { ownerGender?: DemographicType | null; ownerRace?: DemographicType | null; ownerReligion?: DemographicType | null; ownerRegion?: LocationType | null; };
  genders: DemographicType[];
  races: DemographicType[];
  religions: DemographicType[];
  regions: LocationType[];
  availableDemographics: DemographicType[]; // New prop
  availableLocations: LocationType[]; // New prop
}

export default function OwnerDetailsForm({ business, genders, races, religions, regions, availableDemographics, availableLocations }: OwnerDetailsFormProps) {
  const [state, formAction] = useFormState<FormState, FormData>(updateBusinessOwnerDetails, undefined);
  const [currentGenderId, setCurrentGenderId] = useState<number | null>(business.ownerGenderId || null);
  const [currentRaceId, setCurrentRaceId] = useState<number | null>(business.ownerRaceId || null);
  const [currentReligionId, setCurrentReligionId] = useState<number | null>(business.ownerReligionId || null);
  const [currentRegionId, setCurrentRegionId] = useState<number | null>(business.ownerRegionId || null);
  const [selectedDemographicIds, setSelectedDemographicIds] = useState<number[]>(business.demographicIds || []); // New state for business demographics
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(business.locationId || null); // New state for business location

  useEffect(() => {
    if (state?.message === "Owner details updated successfully!") {
      // Optionally, show a success message or revalidate data
    }
  }, [state]);

  const handleDemographicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map(option => parseInt(option.value));
    setSelectedDemographicIds(values);
  };

  return (
    <form action={formAction} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <input type="hidden" name="businessId" value={business.id} />

      {/* Gender Dropdown */}
      <div>
        <label htmlFor="ownerGenderId" className="block text-sm font-medium text-gray-700">
          Owner Gender
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
          Owner Race
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
          Owner Religion
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
          Owner Region
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

      {/* New: Business Demographics Multi-select */}
      <div>
        <label htmlFor="demographicIds" className="block text-sm font-medium text-gray-700">
          Business Demographics
        </label>
        <select
          id="demographicIds"
          name="demographicIds"
          multiple
          value={selectedDemographicIds.map(String)} // Convert numbers to strings for select value
          onChange={handleDemographicChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-32" // Increased height for multi-select
        >
          {availableDemographics.map((demo) => (
            <option key={demo.id} value={demo.id}>
              {demo.name} ({demo.category})
            </option>
          ))}
        </select>
        <input type="hidden" name="selectedDemographicIds" value={JSON.stringify(selectedDemographicIds)} />
      </div>

      {/* New: Business Primary Location Dropdown */}
      <div>
        <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
          Business Primary Location
        </label>
        <select
          id="locationId"
          name="locationId"
          value={selectedLocationId || ''}
          onChange={(e) => setSelectedLocationId(parseInt(e.target.value) || null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Primary Location</option>
          {availableLocations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.category})
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
