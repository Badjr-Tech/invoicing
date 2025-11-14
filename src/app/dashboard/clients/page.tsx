import { getClients } from "./actions";
import { getAllUserBusinesses } from "../businesses/actions"; // New import
import ClientsPageClient from "./ClientsPageClient";

export default async function ClientsPage() {
  const clients = await getClients();
  const businesses = await getAllUserBusinesses(); // New: Fetch businesses

  return <ClientsPageClient clients={clients} businesses={businesses} />;
}
