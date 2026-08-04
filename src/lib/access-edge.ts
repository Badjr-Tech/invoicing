import { neon } from '@neondatabase/serverless';
import { evaluateAccess } from '@/lib/onboarding';

/**
 * Gate check for middleware.
 *
 * A locked member can browse the whole portal — the point is that they see
 * what they are getting — so this is only consulted on requests that would
 * change something. Reads never pay for it.
 *
 * Neon's driver talks over HTTP, so it runs on the edge runtime. Drizzle is
 * deliberately not imported here: pulling the schema into the middleware
 * bundle costs far more than one hand-written query.
 */
export async function isGated(userId: number): Promise<boolean> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Fail open rather than locking everyone out of a misconfigured deploy.
    // Server-side checks still stand behind this.
    console.error('[access-edge] DATABASE_URL is not set; skipping gate check.');
    return false;
  }

  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT
        u.created_at,
        u.tour_completed_at,
        u.onboarding_completed_at,
        u.onboarding_meeting_booked_at,
        u.gate_exempt_until,
        EXISTS (SELECT 1 FROM businesses b WHERE b.user_id = u.id) AS has_business,
        COALESCE(
          (SELECT bool_or(b.stripe_charges_enabled) FROM businesses b WHERE b.user_id = u.id),
          false
        ) AS charges_enabled
      FROM users u
      WHERE u.id = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return false;

    const toDate = (value: unknown): Date | null =>
      value ? new Date(value as string) : null;

    const access = evaluateAccess({
      createdAt: new Date(row.created_at as string),
      tourCompletedAt: toDate(row.tour_completed_at),
      onboardingCompletedAt: toDate(row.onboarding_completed_at),
      onboardingMeetingBookedAt: toDate(row.onboarding_meeting_booked_at),
      gateExemptUntil: toDate(row.gate_exempt_until),
      hasBusiness: Boolean(row.has_business),
      stripeChargesEnabled: Boolean(row.charges_enabled),
    });

    return access.gated;
  } catch (error) {
    // A database hiccup must not hard-lock the product.
    console.error('[access-edge] gate check failed:', error);
    return false;
  }
}
