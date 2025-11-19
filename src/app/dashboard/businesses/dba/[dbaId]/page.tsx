import { notFound } from "next/navigation";
import { getDbaProfile } from "../actions";
import DbaDetailClientPage from "./DbaDetailClientPage";

export default async function DbaDetailsPage({ params }: { params: { dbaId: string } }) {
  const dbaId = parseInt(params.dbaId);

  if (isNaN(dbaId)) {
    notFound();
  }

  const dba = await getDbaProfile(dbaId);

  if (!dba) {
    notFound();
  }

  return <DbaDetailClientPage initialDba={dba} />;
}
