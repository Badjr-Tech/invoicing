import { getServices } from "./actions";
import ServicesPageClient from "./ServicesPageClient";

export default async function ServicesPage() {
  const services = await getServices();

  return <ServicesPageClient services={services} />;
}
