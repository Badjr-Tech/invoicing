"use client";

import { useState, useEffect } from "react";
import { getBusinessProfile } from "../actions"; // Import getBusinessProfile
import { Business, DemographicType, LocationType } from "@/db/schema"; // Import necessary types
import Image from "next/image";
import EditBusinessProfileForm from "./EditBusinessProfileForm";
import BusinessMaterials from "./BusinessMaterials";
import OwnerDetailsForm from "./OwnerDetailsForm";
import BusinessDesignForm from "./BusinessDesignForm"; // New import

interface BusinessDetailClientPageProps {
  initialBusiness: Business & { dbas: { id: number; name: string; }[] } & { ownerGender?: Demograp
hicType | null; ownerRace?: DemographicType | null; ownerReligion?: DemographicType | null; ownerR
egion?: LocationType | null; color1?: string | null; color2?: string | null; color3?: string | nul
l; color4?: string | null; };
  genders: DemographicType[];
  races: DemographicType[];
  religions: DemographicType[];
  regions: LocationType[];
  availableDemographics: DemographicType[]; // Re-added
  availableLocations: LocationType[]; // Re-added
}

export default function BusinessDetailClientPage({ initialBusiness, genders, races, religions, reg
ions, availableDemographics, availableLocations }: BusinessDetailClientPageProps) {
  const [business, setBusiness] = useState(initialBusiness);
  const [activeTab, setActiveTab] = useState('business-profile');

  return (
    <div className="flex-1 p-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('business-profile')}
            className={`${activeTab === 'business-profile' ? 'border-indigo-500 text-indigo-600' :
 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap p
y-4 px-1 border-b-2 font-medium text-sm`}
          >
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab('owner-details')}
            className={`${activeTab === 'owner-details' ? 'border-indigo-500 text-indigo-600' : 'b
order-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4
 px-1 border-b-2 font-medium text-sm`}
          >
            Owner Details
          </button>
          <button
            onClick={() => setActiveTab('design')} // New tab for Design
            className={`${activeTab === 'design' ? 'border-indigo-500 text-indigo-600' : 'border-t
ransparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 b
order-b-2 font-medium text-sm`}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('business-materials')}
            className={`${activeTab === 'business-materials' ? 'border-indigo-500 text-indigo-600'
 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap
 py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Business Materials
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`${activeTab === 'edit' ? 'border-indigo-500 text-indigo-600' : 'border-tra
nsparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 bor
der-b-2 font-medium text-sm`}
          >
            Edit
          </button>
        </nav>
      </div>

      {activeTab === 'business-profile' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Business Profile Info */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{business.businessName}</h1>
            <div className="mb-6 flex justify-center">
              {business.logoUrl ? (
                <Image src={business.logoUrl} alt="Business Logo" width={96} height={96} className
="rounded-md object-cover border-2 border-gray-300" />
              ) : (
                <div className="h-24 w-24 rounded-md bg-gray-200 flex items-center justify-center 
text-gray-500 text-4xl font-bold border-2 border-gray-300">
                  {business.businessName ? business.businessName[0].toUpperCase() : '?'}
                </div>
              )}
            </div>
            {business.businessProfilePhotoUrl && (
              <div className="mb-6 flex justify-center">
                <Image src={business.businessProfilePhotoUrl} alt="Business Profile Photo" width={
512} height={512} className="rounded-md object-cover border-2 border-gray-300" />
              </div>
            )}
            <p className="mt-4 text-gray-700">Owner: {business.ownerName}</p>
            <p className="mt-2 text-gray-700">Type: {business.businessType}</p>
            <p className="mt-2 text-gray-700">Tax Status: {business.businessTaxStatus}</p>
            {business.taxFullName && <p className="mt-2 text-gray-700">Tax Full Name: {business.ta
xFullName}</p>}
            {business.dbas && business.dbas.length > 0 && (
              <div className="mt-2 text-gray-700">
                <p className="font-semibold">DBAs:</p>
                <ul className="list-disc list-inside">
                  {business.dbas.map((dba) => (
                    <li key={dba.id}>{dba.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-2 text-gray-700">Industry: {business.businessIndustry}</p>
            {business.businessDescription && <p className="mt-2 text-gray-700">Description: {busin
ess.businessDescription}</p>}
            {business.streetAddress && <p className="mt-2 text-gray-700">Address: {business.street
Address}, {business.city}, {business.state} {business.zipCode}</p>}
            {business.phone && <p className="mt-2 text-gray-700">Phone: {business.phone}</p>}
            {business.website && <p className="mt-2 text-gray-700">Website: <a href={business.webs
ite} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{busine
ss.website}</a></p>}
          </div>

          {/* Right Column: Business Documents */}
          <div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Business Documents</h2>
              <ul>
                {business.material1Url && (
                  <li>
                    <a href={business.material1Url} target="_blank" rel="noopener noreferrer" clas
sName="text-indigo-600 hover:underline">
                      {business.material1Title || 'Document 1'}
                    </a>
                  </li>
                )}
                {business.material2Url && (
                  <li>
                    <a href={business.material2Url} target="_blank" rel="noopener noreferrer" clas
sName="text-indigo-600 hover:underline">
                      {business.material2Title || 'Document 2'}
                    </a>
                  </li>
                )}
                {business.material3Url && (
                  <li>
                    <a href={business.material3Url} target="_blank" rel="noopener noreferrer" clas
sName="text-indigo-600 hover:underline">
                      {business.material3Title || 'Document 3'}
                    </a>
                  </li>
                )}
                {business.material4Url && (
                  <li>
                    <a href={business.material4Url} target="_blank" rel="noopener noreferrer" clas
sName="text-indigo-600 hover:underline">
                      {business.material4Title || 'Document 4'}
                    </a>
                  </li>
                )}
                {business.material5Url && (
                  <li>
                    <a href={business.material5Url} target="_blank" rel="noopener noreferrer" clas
sName="text-indigo-600 hover:underline">
                      {business.material5Title || 'Document 5'}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'owner-details' && ( // New tab content
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Owner Details Form */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Owner Details</h2>
            <OwnerDetailsForm
              business={business}
              genders={genders}
              races={races}
              religions={religions}
              regions={regions}
              availableDemographics={availableDemographics} // Pass new prop
              availableLocations={availableLocations} // Pass new prop
            />
          </div>
          {/* Right Column: Placeholder for future additions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Additional Information</h2>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-gray-700">Content for this section will be added later.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'design' && ( // New tab content for Design
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Business Design</h2>
          <BusinessDesignForm business={business} />
        </div>
      )}

      {activeTab === 'business-materials' && (
        <div className="mt-8">
          <BusinessMaterials business={business} />
        </div>
      )}

      {activeTab === 'edit' && (
        <div className="mt-8">
          <EditBusinessProfileForm initialBusiness={business} availableDemographics={availableDemo
graphics} availableLocations={availableLocations} />
        </div>
      )}
    </div>
  );
}