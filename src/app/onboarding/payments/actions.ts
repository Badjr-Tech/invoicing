"use server";

import { requireUser } from "@/lib/session";
import { ownsBusiness } from "@/lib/tenancy";

export type ConnectResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Begin Stripe Connect onboarding for a business (spec §3.1).
 *
 * INTEGRATION POINT — not yet wired to Stripe.
 *
 * The surrounding flow is complete: the caller is authenticated, ownership is
 * checked, and the result shape is what the client expects. What remains is
 * the Stripe call itself, which needs the `stripe` package and live keys:
 *
 *   1. Create an Express account with controller.fees.payer = 'application'.
 *      That setting is NOT changeable afterward and the whole fee model
 *      depends on it (spec §2.1).
 *   2. Persist the returned account ID to businesses.stripeConnectAccountId
 *      IMMEDIATELY, before onboarding completes, so an abandoned flow resumes
 *      instead of orphaning an account.
 *   3. Create an Account Link with refresh_url and return_url pointing back
 *      to /onboarding/payments, and return its URL here.
 *   4. Let the account.updated webhook set stripeChargesEnabled — never trust
 *      the browser's return trip as proof the account is live.
 */
export async function startStripeConnect(businessId: number): Promise<ConnectResult> {
  const user = await requireUser();

  if (!(await ownsBusiness(user.id, businessId))) {
    return { ok: false, error: "You do not have access to that business." };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      ok: false,
      error:
        "Payments are not configured yet. Add STRIPE_SECRET_KEY and complete the Connect integration.",
    };
  }

  return {
    ok: false,
    error: "Stripe Connect is not wired up yet — see startStripeConnect in this file.",
  };
}
