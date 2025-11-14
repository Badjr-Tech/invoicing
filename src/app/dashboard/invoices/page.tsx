import { getInvoices } from "../invoicing/actions";
import InvoicesPageClient from "./InvoicesPageClient";

export default async function InvoicesPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const showArchived = searchParams?.showArchived === 'true';
  const invoices = await getInvoices(showArchived);

  return <InvoicesPageClient invoices={invoices} showArchived={showArchived} />;
}
