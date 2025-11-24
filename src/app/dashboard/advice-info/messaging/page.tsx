import { getSession } from "@/app/login/actions";
import AdviceInfoMessagingClientPage from "./AdviceInfoMessagingClientPage";

export default async function AdviceInfoMessagingPage() {
  const session = await getSession();
  const isAdmin = session?.user?.role === 'admin';
  const isExternal = session?.user?.role === 'external'; // Assuming 'external' is a role for external users
  const currentUserId = session?.user?.id || null;

  return (
    <AdviceInfoMessagingClientPage
      isAdmin={isAdmin}
      isExternal={isExternal}
      currentUserId={currentUserId}
    />
  );
}
