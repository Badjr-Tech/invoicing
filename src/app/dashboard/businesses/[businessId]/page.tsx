import { notFound } from "next/navigation";
import { getBusinessProfile, getDemographicsByCategory, getLocationsByCategory } from "../actions"; // Import getBusinessProfile and new actions
import { Business, Demographic, Location } from "@/db/schema"; // Import necessary types
import BusinessDetailClientPage from "./BusinessDetailClientPage"; // Import BusinessDetailClientPage

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BusinessDetailPage({ params }: { params: { businessId: string } & Promise<any> }) {
  console.log('--- BusinessDetailPage loaded for businessId:', params.businessId, '---');
  const businessId = parseInt(params.businessId);

  if (isNaN(businessId)) {
    notFound();
  }

  const business: (Business & { ownerGender?: Demographic | null; ownerRace?: Demographic | null; ownerReligion?: Demographic | null; ownerRegion?: Location | null; }) | null = await getBusinessProfile(businessId); // Use the new type
  const genders = await getDemographicsByCategory('Gender'); // Fetch genders
  const races = await getDemographicsByCategory('Race'); // Fetch races
  const religions = await getDemographicsByCategory('Religion'); // Fetch religions
  const regions = await getLocationsByCategory('Region'); // Fetch regions

  if (!business) {
    notFound();
  }

  return <BusinessDetailClientPage initialBusiness={business} genders={genders} races={races} religions={religions} regions={regions} />;
}