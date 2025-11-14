import { getInvoices } from "../invoicing/actions";
import InvoicesPageClient from "./InvoicesPageClient";

export default async function InvoicesPage({ searchParams }: { searchParams?: Promise<any> }) {
  const resolvedSearchParams = await searchParams;
  const showArchived = resolvedSearchParams?.showArchived === 'true';
  const invoices = await getInvoices(showArchived);

  return <InvoicesPageClient invoices={invoices} showArchived={showArchived} />;
}
