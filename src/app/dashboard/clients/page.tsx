import { getClients } from "./actions";
import { getAllUserBusinesses } from "../businesses/actions"; // New import
import ClientsPageClient from "./ClientsPageClient";
import { getSession } from "@/app/login/actions"; // New import

export default async function ClientsPage() {
  const session = await getSession();
  if (!session || !session.user) {
    // Handle unauthenticated user, e.g., redirect to login or return empty data
    return <ClientsPageClient clients={[]} businesses={[]} />;
  }

  const clients = await getClients();
  const businesses = await getAllUserBusinesses(session.user.id); // New: Pass userId

  return <ClientsPageClient clients={clients} businesses={businesses} />;
}
