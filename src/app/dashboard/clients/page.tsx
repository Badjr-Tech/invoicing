import { getClients } from "./actions";
import ClientsPageClient from "./ClientsPageClient";

export default async function ClientsPage() {
  const clients = await getClients();

  return <ClientsPageClient clients={clients} />;
}
