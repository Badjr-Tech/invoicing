import { db } from '@/db';
import { businesses, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { evaluateAccess, type AccessState } from '@/lib/onboarding';

/**
 * Load the member's trial and onboarding state.
 *
 * This reads the database rather than the session, because onboarding
 * progress changes without the user logging in again (a Stripe webhook can
 * flip charges_enabled at any moment) and a stale cookie must never be what
 * decides whether the tools are unlocked.
 */
export async function loadAccessState(userId: number): Promise<AccessState | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return null;

  const owned = await db
    .select({
      id: businesses.id,
      stripeChargesEnabled: businesses.stripeChargesEnabled,
    })
    .from(businesses)
    .where(eq(businesses.userId, userId));

  return evaluateAccess({
    createdAt: user.createdAt,
    tourCompletedAt: user.tourCompletedAt,
    onboardingCompletedAt: user.onboardingCompletedAt,
    onboardingMeetingBookedAt: user.onboardingMeetingBookedAt,
    gateExemptUntil: user.gateExemptUntil,
    hasBusiness: owned.length > 0,
    // Any one connected business is enough to unlock the tools.
    stripeChargesEnabled: owned.some((b) => b.stripeChargesEnabled),
  });
}
