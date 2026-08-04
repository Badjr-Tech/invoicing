/**
 * Trial and onboarding access rules.
 *
 * A new member gets 7 days of full access from signup so they can see what
 * the platform does before being asked for anything. When the trial ends the
 * tools lock until onboarding is complete — Stripe connected, business
 * registered, intake meeting booked.
 *
 * The pure functions here take plain data so the rules can be tested without
 * a database. Loading lives in onboarding-access.ts.
 */

export const TRIAL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export type OnboardingStepId =
  | 'tour'
  | 'business'
  | 'payments'
  | 'meeting';

export interface OnboardingFacts {
  /** When the member signed up. Start of the trial clock. */
  createdAt: Date;
  tourCompletedAt: Date | null;
  onboardingCompletedAt: Date | null;
  onboardingMeetingBookedAt: Date | null;
  /** Admin override that keeps access open past the trial. */
  gateExemptUntil: Date | null;
  /** True once the member has at least one business profile. */
  hasBusiness: boolean;
  /** True once Stripe Connect reports the account can accept charges. */
  stripeChargesEnabled: boolean;
}

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
  description: string;
  complete: boolean;
  /** Where the member goes to finish this step. */
  href: string;
}

export interface AccessState {
  steps: OnboardingStep[];
  /** Every required step is done. */
  onboardingComplete: boolean;
  /** Whole days left in the trial. Zero once it has run out. */
  trialDaysRemaining: number;
  trialActive: boolean;
  /** True when the tools should be locked. */
  gated: boolean;
  /** Fraction of required steps finished, 0–1, for progress display. */
  progress: number;
}

export function buildSteps(facts: OnboardingFacts): OnboardingStep[] {
  return [
    {
      id: 'tour',
      title: 'See how AGENCY works',
      description: 'A short walkthrough of the platform and how it earns with you.',
      complete: facts.tourCompletedAt !== null,
      href: '/onboarding/tour',
    },
    {
      id: 'business',
      title: 'Register your business',
      description: 'Your legal details, industry, and ownership.',
      complete: facts.hasBusiness,
      href: '/dashboard/businesses/create',
    },
    {
      id: 'payments',
      title: 'Connect payments',
      description: 'Link Stripe so you can invoice clients and get paid.',
      complete: facts.stripeChargesEnabled,
      href: '/onboarding/payments',
    },
    {
      id: 'meeting',
      title: 'Book your onboarding meeting',
      description: 'A working session to map your business and set your plan.',
      complete: facts.onboardingMeetingBookedAt !== null,
      href: '/onboarding/meeting',
    },
  ];
}

/**
 * Whole days left in the trial, never negative.
 *
 * Rounded up so a member partway through day 7 still reads "1 day left"
 * rather than "0 days left" while they can still use everything.
 */
export function trialDaysRemaining(createdAt: Date, now: Date = new Date()): number {
  const endsAt = createdAt.getTime() + TRIAL_DAYS * DAY_MS;
  const remainingMs = endsAt - now.getTime();
  if (remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / DAY_MS);
}

export function evaluateAccess(
  facts: OnboardingFacts,
  now: Date = new Date(),
): AccessState {
  const steps = buildSteps(facts);
  const completedCount = steps.filter((step) => step.complete).length;
  const onboardingComplete =
    facts.onboardingCompletedAt !== null || completedCount === steps.length;

  const daysLeft = trialDaysRemaining(facts.createdAt, now);
  const trialActive = daysLeft > 0;

  const exempt =
    facts.gateExemptUntil !== null && facts.gateExemptUntil.getTime() > now.getTime();

  // Locked only once the trial has run out and onboarding is still unfinished.
  const gated = !onboardingComplete && !trialActive && !exempt;

  return {
    steps,
    onboardingComplete,
    trialDaysRemaining: daysLeft,
    trialActive,
    gated,
    progress: completedCount / steps.length,
  };
}
