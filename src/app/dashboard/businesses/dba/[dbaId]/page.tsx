import { notFound } from "next/navigation";
import { getDbaProfile } from "../actions";
import DbaDetailClientPage from "./DbaDetailClientPage";

type PageProps = {
  params: { dbaId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function DbaDetailsPage({ params }: PageProps) {
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
