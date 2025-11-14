import { getClients } from "../clients/actions";
import { getServices } from "../services/actions";
import { getServiceCategories } from "../services/categories/actions"; // New import
import InvoicingPageClient from "./InvoicingPageClient";

export default async function InvoicingPage() {
  const clients = await getClients();
  const services = await getServices(); // getServices now fetches with category details
  const categories = await getServiceCategories(); // New: Fetch categories

  return <InvoicingPageClient clients={clients} services={services} categories={categories} />;
}

