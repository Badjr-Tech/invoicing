import { getClients } from "./actions";
import { getAllUserBusinesses } from "../businesses/actions"; // Re-add import
import ClientsPageClient from "./ClientsPageClient";
import { getSession } from "@/app/login/actions";
import { ClientWithBusiness } from "@/db/schema"; // Re-add import

export default async function ClientsPage() {
  const session = await getSession();
  if (!session || !session.user) {
    return <ClientsPageClient clients={[]} businesses={[]} />; // Re-add businesses prop
  }

  const clients: ClientWithBusiness[] = await getClients(); // Use ClientWithBusiness type
  const businesses = await getAllUserBusinesses(session.user.id); // Re-add call

  return <ClientsPageClient clients={clients} businesses={businesses} />;
}
