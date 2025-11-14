import { getClients } from "./actions";
import { getAllUserBusinesses } from "../businesses/actions";
import ClientsPageClient from "./ClientsPageClient";
import { getSession } from "@/app/login/actions";
import { ClientWithBusiness } from "@/db/schema"; // New import for enriched client type

export default async function ClientsPage() {
  const session = await getSession();
  if (!session || !session.user) {
    return <ClientsPageClient clients={[]} businesses={[]} />;
  }

  const clients: ClientWithBusiness[] = await getClients(); // Use the enriched client type
  const businesses = await getAllUserBusinesses(session.user.id);

  return <ClientsPageClient clients={clients} businesses={businesses} />;
}
