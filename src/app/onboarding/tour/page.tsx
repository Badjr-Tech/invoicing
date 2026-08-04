import { requireUser } from "@/lib/session";
import { loadAccessState } from "@/lib/onboarding-access";
import TourClient from "./TourClient";

export default async function TourPage() {
  const user = await requireUser();
  // Read from the database rather than the session — onboarding state is not
  // carried in the cookie.
  const access = await loadAccessState(user.id);
  const tourStep = access?.steps.find((step) => step.id === "tour");

  return <TourClient alreadyComplete={tourStep?.complete ?? false} />;
}
