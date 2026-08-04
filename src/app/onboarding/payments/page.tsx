import Link from "next/link";
import { ArrowLeft, Building2, Landmark, ShieldCheck } from "lucide-react";
import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/session";
import ConnectButton from "./ConnectButton";

export default async function PaymentsStepPage() {
  const user = await requireUser();

  const owned = await db
    .select({
      id: businesses.id,
      businessName: businesses.businessName,
      status: businesses.stripeConnectStatus,
      chargesEnabled: businesses.stripeChargesEnabled,
    })
    .from(businesses)
    .where(eq(businesses.userId, user.id));

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/onboarding"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-clay-600 hover:text-clay-800"
      >
        <ArrowLeft size={16} /> Setup
      </Link>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-sage-600">
        Step 3
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-clay-800">
        Connect your payments.
      </h1>
      <p className="mt-3 text-clay-700">
        This is how you invoice clients and how the money reaches your bank.
        We use Stripe, so your bank details are handled by them and never
        stored by AGENCY.
      </p>

      <ul className="mt-6 space-y-3">
        {[
          [Landmark, "Bank transfer is the default", "It costs the least, so it stays your standard option. Cards can be enabled later."],
          [ShieldCheck, "Stripe handles verification", "Identity and bank checks happen on their side, not ours."],
          [Building2, "Your business is the merchant", "Your client is buying from you. We only take our share as it passes through."],
        ].map(([Icon, title, detail]) => {
          const Component = Icon as typeof Landmark;
          return (
            <li key={title as string} className="flex gap-3 rounded-card border border-clay-200 bg-white p-4">
              <Component size={18} className="mt-0.5 shrink-0 text-sage-500" />
              <span>
                <strong className="block text-sm font-semibold text-clay-800">
                  {title as string}
                </strong>
                <span className="text-sm text-clay-600">{detail as string}</span>
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        {owned.length === 0 ? (
          <div className="rounded-card border border-ember-200 bg-ember-50 p-5">
            <p className="text-sm font-semibold text-clay-800">
              Register your business first.
            </p>
            <p className="mt-1 text-sm text-clay-600">
              Stripe needs your business details before it can verify you.
            </p>
            <Link
              href="/dashboard/businesses/create"
              className="mt-4 inline-block rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500"
            >
              Register business
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {owned.map((business) => (
              <div
                key={business.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-clay-200 bg-white p-5"
              >
                <div>
                  <p className="font-semibold text-clay-800">{business.businessName}</p>
                  <p className="mt-0.5 text-sm text-clay-600">
                    {business.chargesEnabled
                      ? "Connected and ready to accept payments."
                      : business.status === "restricted"
                        ? "Stripe needs more information before you can be paid."
                        : "Not connected yet."}
                  </p>
                </div>
                <ConnectButton
                  businessId={business.id}
                  connected={business.chargesEnabled}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
