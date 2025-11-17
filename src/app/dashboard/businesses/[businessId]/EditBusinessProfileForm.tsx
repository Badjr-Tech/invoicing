'use client';

import { useState } from "react";
import { Business, DemographicType, LocationType } from "@/db/schema"; // Updated import
import { updateBusinessProfile, createDba, deleteDba } from "../actions";
import { useFormState } from "react-dom";
import Image from "next/image";

type FormState = {
  message: string;
  error: string;
} | undefined;

interface EditBusinessProfileFormProps {
  initialBusiness: Business & { dbas: { id: number; name: string; }[] } & { ownerGender?: DemographicType | null; ownerRace?: DemographicType | null; ownerReligion?: DemographicType | null; ownerRegion?: LocationType | null; color1?: string | null; color2?: string | null; color3?: string | null; color4?: string | null; }; // Updated type
  availableDemographics: DemographicType[];
  availableLocations: LocationType[];
}

export default function EditBusinessProfileForm({ initialBusiness, availableDemographics, availableLocations }: EditBusinessProfileFormProps) {
  const [business, setBusiness] = useState(initialBusiness); // Updated type
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(business.logoUrl);
  const [dbas, setDbas] = useState(initialBusiness.dbas || []);
  const [newDba, setNewDba] = useState("");
  const [createDbaState, createDbaAction] = useFormState(createDba, undefined);
  const [deleteDbaState, deleteDbaAction] = useFormState(deleteDba, undefined);

  const [editState, editFormAction] = useFormState<FormState, FormData>(updateBusinessProfile, undefined);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (business.logoUrl && !confirm("Are you sure you want to override your current logo?")) {
        e.target.value = ''; // Clear the input if user cancels
        setLogoFile(null);
        setLogoPreview(business.logoUrl);
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoFile(null);
      setLogoPreview(business.logoUrl);
    }
  };

  return (
    <form action={editFormAction} className="space-y-6">
      <input type="hidden" name="businessId" value={business.id} />
      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
          Business Name
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          defaultValue={business.businessName}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* Owner Name */}
      <div>
        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
          Owner Name
        </label>
        <input
          id="ownerName"
          name="ownerName"
          type="text"
          defaultValue={business.ownerName}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* Percent Ownership */}
      <div>
        <label htmlFor="percentOwnership" className="block text-sm font-medium text-gray-700">
          Percent Ownership
        </label>
        <input
          id="percentOwnership"
          name="percentOwnership"
          type="number"
          step="0.01"
          defaultValue={business.percentOwnership}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
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
          defaultValue={business.businessType}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
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
          defaultValue={business.businessTaxStatus}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
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
          {dbas.map((dba) => (
            <div key={dba.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
              <p>{dba.name}</p>
              <form action={deleteDbaAction}>
                <input type="hidden" name="id" value={dba.id} />
                <button
                  type="submit"
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
        <form action={createDbaAction} className="mt-4 flex items-center">
          <input type="hidden" name="businessId" value={initialBusiness.id} />
          <input
            type="text"
            name="name"
            value={newDba}
            onChange={(e) => setNewDba(e.target.value)}
            placeholder="Enter DBA name"
            className="flex-grow border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add DBA
          </button>
        </form>
        {createDbaState?.error && <p className="text-red-600 text-sm mt-2">{createDbaState.error}</p>}
      </div>

      {/* Business Description */}
      <div>
        <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
          Business Description
        </label>
        <textarea
          id="businessDescription"
          name="businessDescription"
          rows={3}
          defaultValue={business.businessDescription || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        ></textarea>
      </div>

      {/* Business Industry */}
      <div>
        <label htmlFor="businessIndustry" className="block text-sm font-medium text-gray-700">
          Business Industry
        </label>
        <input
          id="businessIndustry"
          name="businessIndustry"
          type="text"
          defaultValue={business.businessIndustry}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          id="streetAddress"
          name="streetAddress"
          type="text"
          defaultValue={business.streetAddress || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          id="city"
          name="city"
          type="text"
          defaultValue={business.city || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* State */}
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State
        </label>
        <input
          id="state"
          name="state"
          type="text"
          maxLength={2}
          defaultValue={business.state || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* Zip Code */}
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
          Zip Code
        </label>
        <input
          id="zipCode"
          name="zipCode"
          type="text"
          maxLength={10}
          defaultValue={business.zipCode || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <select
          id="locationId"
          name="locationId"
          defaultValue={business.locationId || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        >
          <option value="">Select Location</option>
          {availableLocations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          defaultValue={business.phone || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* Website */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          id="website"
          name="website"
          type="text"
          defaultValue={business.website || ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
        />
      </div>

      {/* Business Logo Upload */}
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
          Business Logo
        </label>
        <div className="mt-2">
          <input
            id="logo"
            name="logo"
            type="file"
            onChange={handleLogoChange}
            className="block w-full text-sm text-foreground border border-gray-300 rounded-lg cursor-pointer bg-background focus:outline-none"
          />
        </div>
        {logoPreview && (
          <div className="mt-4">
            <Image src={logoPreview} alt="Logo Preview" width={96} height={96} className="rounded-md object-cover" />
          </div>
        )}
      </div>

      {/* Business Profile Photo Upload */}
      <div>
        <label htmlFor="businessProfilePhoto" className="block text-sm font-medium text-gray-700">
          Business Profile Photo
        </label>
        <div className="mt-2">
          <input
            id="businessProfilePhoto"
            name="businessProfilePhoto"
            type="file"
            className="block w-full text-sm text-foreground border border-gray-300 rounded-lg cursor-pointer bg-background focus:outline-none"
          />
        </div>
      </div>

      {editState?.message && (
        <p className="text-sm text-green-600 mt-2">{editState.message}</p>
      )}
      {editState?.error && (
        <p className="text-sm text-red-600 mt-2">{editState.error}</p>
      )}

      <div className="mt-6">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-[#910000] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#7a0000] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
