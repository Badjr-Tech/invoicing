import { requireUser } from "@/lib/session";
import { loadAccessState } from "@/lib/onboarding-access";
import DynamicSidebarContent from "@/app/dashboard/components/DynamicSidebarContent";
import DashboardChrome from "@/app/dashboard/components/DashboardChrome";
import TrialBanner from "@/app/dashboard/components/TrialBanner";
import LockedBanner from "@/app/dashboard/components/LockedBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const access = await loadAccessState(user.id);

  // A locked member is deliberately NOT redirected away. They can open every
  // screen and see exactly what they are getting — that is the argument for
  // finishing setup. Writes are refused server-side, so browsing is safe.
  const locked = access?.gated ?? false;

  const banner = locked ? (
    <LockedBanner steps={access?.steps ?? []} progress={access?.progress ?? 0} />
  ) : access && !access.onboardingComplete ? (
    <TrialBanner
      daysRemaining={access.trialDaysRemaining}
      progress={access.progress}
    />
  ) : null;

  return (
    <DashboardChrome sidebar={<DynamicSidebarContent />} banner={banner}>
      {children}
    </DashboardChrome>
  );
}
