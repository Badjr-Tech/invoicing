import { getInvoices } from "../invoicing/actions";
import InvoicesPageClient from "./InvoicesPageClient";
import { searchParams } from "next/navigation"; // Import searchParams

export default async function InvoicesPage({ searchParams }: { searchParams: { showArchived?: string } }) {
  const showArchived = searchParams.showArchived === 'true';
  const invoices = await getInvoices(showArchived);

  return <InvoicesPageClient invoices={invoices} showArchived={showArchived} />;
}
