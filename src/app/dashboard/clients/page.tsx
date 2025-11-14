import { getClients } from "./actions";
import ClientsPageClient from "./ClientsPageClient";
import { getSession } from "@/app/login/actions";
import { Client } from "@/db/schema"; // Import Client type

export default async function ClientsPage() {
  const session = await getSession();
  if (!session || !session.user) {
    return <ClientsPageClient clients={[]} />;
  }

  const clients = await getClients(); // Use the Client type

  return <ClientsPageClient clients={clients} />;
}
