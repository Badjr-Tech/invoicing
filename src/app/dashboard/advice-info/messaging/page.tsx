import { getSession } from "@/app/login/actions";
import AdviceInfoMessagingClientPage from "./AdviceInfoMessagingClientPage";
import { getHelpRequests, getReferralsSentByAdmin } from "./actions";
import { HelpRequest, Referral } from "@/db/schema";

export default async function AdviceInfoMessagingPage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === 'admin';
  const isExternal = session?.user?.role === 'external';
  const currentUserId = session?.user?.id || null;

  let initialHelpRequests: HelpRequest[] = [];
  let initialReferrals: Referral[] = [];

  if (currentUserId) {
    initialHelpRequests = await getHelpRequests(currentUserId);
  }

  // Only admins send referrals, so external users will see referrals sent by admins
  if (isExternal) {
    initialReferrals = await getReferralsSentByAdmin();
  }

  return (
    <AdviceInfoMessagingClientPage
      isAdmin={isAdmin}
      isExternal={isExternal}
      currentUserId={currentUserId}
      initialHelpRequests={initialHelpRequests}
      initialReferrals={initialReferrals}
    />
  );
}
