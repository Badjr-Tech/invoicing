import { notFound } from "next/navigation";
import { getBusinessProfile, getDemographicsByCategory, getLocationsByCategory } from "../actions"; // Import getBusinessProfile and new actions
import { Business, Demographic, Location } from "@/db/schema"; // Import necessary types
import BusinessDetailClientPage from "./BusinessDetailClientPage"; // Import BusinessDetailClientPage
import { db } from "@/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BusinessDetailPage({ params }: { params: { businessId: string } & Promise<any> }) {
  const businessId = parseInt(params.businessId);

  if (isNaN(businessId)) {
    notFound();
  }

  const business = await getBusinessProfile(businessId); // Let TypeScript infer the type
  const genders = await getDemographicsByCategory('Gender'); // Fetch genders
  const races = await getDemographicsByCategory('Race'); // Fetch races
  const religions = await getDemographicsByCategory('Religion'); // Fetch religions
  const regions = await getLocationsByCategory('Region'); // Fetch regions
  const availableDemographics = [
    ...await getDemographicsByCategory('Gender'),
    ...await getDemographicsByCategory('Race'),
    ...await getDemographicsByCategory('Religion'),
  ];
  const availableLocations = [
    ...await getLocationsByCategory('City'),
    ...await getLocationsByCategory('Region'),
  ];

  if (!business) {
    notFound();
  }

  return <BusinessDetailClientPage initialBusiness={business} genders={genders} races={races} religions={religions} regions={regions} availableDemographics={availableDemographics} availableLocations={availableLocations} />;
}