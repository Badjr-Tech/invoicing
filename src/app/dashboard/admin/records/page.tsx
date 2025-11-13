import { getSession } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { getAllInvoices } from "../../invoicing/actions";
import { getAllBusinesses } from "../../businesses/actions";
import { getAllClients } from "../../clients/actions";
import { getAllServices } from "../../services/actions";
import RecordsPageClient from "./RecordsPageClient";

export default async function RecordsPage() {
  const session = await getSession();
  if (!session || !session.user || session.user.role !== 'admin') {
    redirect("/dashboard");
  }

  const invoices = await getAllInvoices();
  const businesses = await getAllBusinesses();
  const clients = await getAllClients();
  const services = await getAllServices();

  return (
    <RecordsPageClient
      invoices={invoices}
      businesses={businesses}
      clients={clients}
      services={services}
    />
  );
}
