"use server";

import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/session";
import { ownsBusiness } from "@/lib/tenancy";
import { getStripe } from "@/lib/stripe";

export type ConnectResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Begin (or resume) Stripe Connect onboarding for a business. Spec §3.1.
 *
 * Express account, with AGENCY as the fee payer:
 * `controller.fees.payer = 'application'` is set at creation and is NOT
 * changeable afterward — the whole fee model rests on it. Stripe requires
 * the platform to also own losses and requirement collection under that
 * setting, which is why those fields travel together below.
 *
 * The account id is stored IMMEDIATELY on creation, before onboarding
 * completes, so an abandoned flow resumes into the same account instead of
 * orphaning one per attempt.
 *
 * Completion is decided by the account.updated webhook flipping
 * stripe_charges_enabled — never by the browser making it back to the
 * return URL, which proves nothing.
 */
export async function startStripeConnect(businessId: number): Promise<ConnectResult> {
  const user = await requireUser();

  if (!(await ownsBusiness(user.id, businessId))) {
    return { ok: false, error: "You do not have access to that business." };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      ok: false,
      error: "Payments are not configured yet. Add STRIPE_SECRET_KEY to the environment.",
    };
  }

  const business = await db.query.businesses.findFirst({
    where: eq(businesses.id, businessId),
  });
  if (!business) {
    return { ok: false, error: "Business not found." };
  }

  const stripe = getStripe();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    let accountId = business.stripeConnectAccountId;

    if (!accountId) {
      const account = await stripe.accounts.create({
        controller: {
          fees: { payer: "application" }, // permanent; load-bearing (spec §2.1)
          losses: { payments: "application" },
          requirement_collection: "stripe",
          stripe_dashboard: { type: "express" },
        },
        business_profile: {
          name: business.businessName,
          ...(business.website ? { url: business.website } : {}),
        },
        metadata: {
          agencyBusinessId: String(business.id),
          agencyUserId: String(user.id),
        },
      });

      accountId = account.id;

      // Persisted before onboarding begins, so a half-finished flow resumes.
      await db
        .update(businesses)
        .set({
          stripeConnectAccountId: accountId,
          stripeConnectStatus: "onboarding",
        })
        .where(eq(businesses.id, business.id));
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      refresh_url: `${baseUrl}/onboarding/payments?refresh=1`,
      return_url: `${baseUrl}/onboarding/payments?returned=1`,
    });

    return { ok: true, url: link.url };
  } catch (error: unknown) {
    console.error("[stripe-connect] failed to start onboarding:", error);
    const message =
      error instanceof Error ? error.message : "Unknown Stripe error.";
    return { ok: false, error: `Could not start Stripe onboarding: ${message}` };
  }
}
