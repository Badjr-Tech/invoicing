import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { loadAccessState } from "@/lib/onboarding-access";
import DynamicSidebarContent from "@/app/dashboard/components/DynamicSidebarContent";
import TrialBanner from "@/app/dashboard/components/TrialBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  // The tools stay open for the 7-day trial. Once it lapses, an unfinished
  // member is sent to /onboarding, which lives outside /dashboard so this
  // redirect cannot loop.
  const access = await loadAccessState(user.id);
  if (access?.gated) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-clay-50">
      <aside className="relative w-64 shrink-0 bg-sage-800 text-sage-50 px-4 pt-4 space-y-2">
        <DynamicSidebarContent />
      </aside>

      <main className="flex-1 flex flex-col text-clay-800 overflow-x-hidden">
        {access && !access.onboardingComplete && (
          <TrialBanner
            daysRemaining={access.trialDaysRemaining}
            progress={access.progress}
          />
        )}
        <div className="flex-1 p-6 lg:p-8">{children}</div>
        <footer className="mt-auto py-6 text-center text-xs text-clay-500">
          AGENCY — DakJen Creative LLC
        </footer>
      </main>
    </div>
  );
}
