import { getInvoices } from "../invoicing/actions";
import InvoicesPageClient from "./InvoicesPageClient";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return <InvoicesPageClient invoices={invoices} />;
}
