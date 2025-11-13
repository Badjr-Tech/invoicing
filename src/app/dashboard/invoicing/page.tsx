import { getClients } from "../clients/actions";
import InvoicingPageClient from "./InvoicingPageClient";

export default async function InvoicingPage() {
  const clients = await getClients();

  return <InvoicingPageClient clients={clients} />;
}

