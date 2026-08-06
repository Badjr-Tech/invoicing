import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { db } from '@/db';
import { businesses, stripeEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getStripe } from '@/lib/stripe';

/**
 * Stripe webhook receiver (spec §3.5).
 *
 * Order of operations is the whole design:
 *   1. Verify the signature — unsigned requests are rejected.
 *   2. Persist the event BEFORE processing, keyed on Stripe's event id.
 *      Stripe retries, so duplicates arrive; onConflictDoNothing makes a
 *      redelivery a no-op instead of a double-process.
 *   3. Process off the stored row and record the outcome on it, so a failed
 *      event is visible and replayable instead of silently dropped.
 *
 * Handlers must tolerate out-of-order delivery: nothing here may assume a
 * related event has already arrived.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set.');
    return new NextResponse('Webhook not configured', { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new NextResponse('Missing signature', { status: 400 });
  }

  // Signature verification needs the exact raw bytes, not parsed JSON.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return new NextResponse('Invalid signature', { status: 400 });
  }

  // Persist first. A duplicate id means Stripe redelivered; acknowledge and stop.
  const inserted = await db
    .insert(stripeEvents)
    .values({ id: event.id, type: event.type, payload: rawBody })
    .onConflictDoNothing()
    .returning({ id: stripeEvents.id });

  if (inserted.length === 0) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    await processEvent(event);
    await db
      .update(stripeEvents)
      .set({ processedAt: new Date() })
      .where(eq(stripeEvents.id, event.id));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[stripe-webhook] processing ${event.id} (${event.type}) failed:`, error);
    await db
      .update(stripeEvents)
      .set({ error: message })
      .where(eq(stripeEvents.id, event.id));
    // Still 200: the event is stored and replayable. A 5xx would make Stripe
    // redeliver forever what the unique key will discard anyway.
  }

  return NextResponse.json({ received: true });
}

async function processEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      await handleAccountUpdated(account);
      return;
    }
    default:
      // Unknown types are stored and acknowledged — the log is the archive
      // that later phases (payments, fees, payouts) will backfill from.
      return;
  }
}

/**
 * The webhook — not the browser's return trip — decides when a business can
 * charge. This is what flips the onboarding "Connect payments" step done.
 */
async function handleAccountUpdated(account: Stripe.Account): Promise<void> {
  const business = await db.query.businesses.findFirst({
    where: eq(businesses.stripeConnectAccountId, account.id),
  });
  if (!business) {
    // An account we did not create, or one whose row was deleted. Recorded
    // via the event log; nothing to update.
    return;
  }

  const chargesEnabled = Boolean(account.charges_enabled);
  const payoutsEnabled = Boolean(account.payouts_enabled);

  const status = account.details_submitted
    ? chargesEnabled
      ? 'enabled'
      : 'restricted'
    : 'onboarding';

  await db
    .update(businesses)
    .set({
      stripeChargesEnabled: chargesEnabled,
      stripePayoutsEnabled: payoutsEnabled,
      stripeConnectStatus: status,
      ...(chargesEnabled && !business.stripeConnectOnboardedAt
        ? { stripeConnectOnboardedAt: new Date() }
        : {}),
    })
    .where(eq(businesses.id, business.id));
}
