import { notFound } from "next/navigation";
import { getDbaProfile } from "../../actions";
import DbaDetailClientPage from "./DbaDetailClientPage";


export default async function DbaDetailsPage({ params }: { params: Promise<{ dbaId: string }> }) {
  const { dbaId } = await params;
  const parsedDbaId = parseInt(dbaId);

  if (isNaN(parsedDbaId)) {
    notFound();
  }

  const dba = await getDbaProfile(parsedDbaId);

  if (!dba) {
    notFound();
  }

  return <DbaDetailClientPage initialDba={dba} />;
}