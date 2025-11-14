import { getInvoices } from "../invoicing/actions";
import InvoicesPageClient from "./InvoicesPageClient";

interface InvoicesPageProps {
  searchParams?: {
    showArchived?: string;
  };
}

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const showArchived = searchParams?.showArchived === 'true';
  const invoices = await getInvoices(showArchived);

  return <InvoicesPageClient invoices={invoices} showArchived={showArchived} />;
}
