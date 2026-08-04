import Image from "next/image";
import { requireUser } from "@/lib/session";
import LogoutButton from "@/app/components/LogoutButton";

/**
 * Onboarding shell.
 *
 * Deliberately outside /dashboard: the dashboard layout redirects a gated
 * member here, so nesting it there would loop. It also has no sidebar — the
 * point of this area is one thing at a time.
 */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="min-h-screen bg-clay-50">
      <header className="border-b border-clay-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Image
            src="/agency-logo.svg"
            alt="AGENCY"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 lg:py-14">{children}</main>
    </div>
  );
}
