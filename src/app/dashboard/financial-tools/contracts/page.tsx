import { getClients } from "@/app/dashboard/clients/actions";
import SendContractForm from "./SendContractForm";

export default async function ContractsPage() {
  const clients = await getClients();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground">Send a Contract</h1>
      <div className="mt-6">
        <SendContractForm clients={clients} />
      </div>
    </div>
  );
}
