import { getClients } from "../clients/actions";
import { getServices } from "../services/actions";
import { getServiceCategories } from "../services/categories/actions"; // New import
import { getAllUserBusinesses } from "../businesses/actions"; // New import
import InvoicingPageClient from "./InvoicingPageClient";
import { getSession } from "@/app/login/actions"; // New import

export default async function InvoicingPage({ searchParams }: { searchParams: Promise<{ businessId?: string }> }) {
  const session = await getSession();
  if (!session || !session.user) {
    // Handle unauthenticated user, e.g., redirect to login or return empty data
    return <InvoicingPageClient clients={[]} services={[]} categories={[]} businesses={[]} />;
  }

  const resolvedSearchParams = await searchParams;
  const businessId = resolvedSearchParams.businessId ? parseInt(resolvedSearchParams.businessId) : undefined;

  const clients = await getClients();
  const services = await getServices({ businessId }); // getServices now fetches with category details
  const categories = await getServiceCategories(); // New: Fetch categories
  const businesses = await getAllUserBusinesses(session.user.id); // New: Pass userId

  return <InvoicingPageClient clients={clients} services={services} categories={categories} businesses={businesses} />;
}

