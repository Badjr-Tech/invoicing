import { getClients } from "../clients/actions";
import { getServices } from "../services/actions";
import InvoicingPageClient from "./InvoicingPageClient";

export default async function InvoicingPage() {
  const clients = await getClients();
  const services = await getServices();

  return <InvoicingPageClient clients={clients} services={services} />;
}

