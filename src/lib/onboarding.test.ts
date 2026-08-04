import { describe, expect, it } from 'vitest';
import { TRIAL_DAYS, evaluateAccess, trialDaysRemaining, type OnboardingFacts } from './onboarding';

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-03-10T12:00:00Z');

function facts(overrides: Partial<OnboardingFacts> = {}): OnboardingFacts {
  return {
    createdAt: NOW,
    tourCompletedAt: null,
    onboardingCompletedAt: null,
    onboardingMeetingBookedAt: null,
    gateExemptUntil: null,
    hasBusiness: false,
    stripeChargesEnabled: false,
    ...overrides,
  };
}

const daysAgo = (n: number) => new Date(NOW.getTime() - n * DAY);

describe('trialDaysRemaining', () => {
  it('starts at the full trial length on signup day', () => {
    expect(trialDaysRemaining(NOW, NOW)).toBe(TRIAL_DAYS);
  });

  it('counts down and never goes negative', () => {
    expect(trialDaysRemaining(daysAgo(1), NOW)).toBe(6);
    expect(trialDaysRemaining(daysAgo(6.5), NOW)).toBe(1);
    expect(trialDaysRemaining(daysAgo(7), NOW)).toBe(0);
    expect(trialDaysRemaining(daysAgo(90), NOW)).toBe(0);
  });
});

describe('evaluateAccess — during the trial', () => {
  it('leaves a brand new member ungated with nothing done', () => {
    const state = evaluateAccess(facts(), NOW);
    expect(state.gated).toBe(false);
    expect(state.trialActive).toBe(true);
    expect(state.onboardingComplete).toBe(false);
    expect(state.progress).toBe(0);
  });

  it('stays ungated on the last day of the trial', () => {
    const state = evaluateAccess(facts({ createdAt: daysAgo(6.9) }), NOW);
    expect(state.gated).toBe(false);
    expect(state.trialDaysRemaining).toBe(1);
  });
});

describe('evaluateAccess — after the trial', () => {
  it('gates a member who never finished onboarding', () => {
    const state = evaluateAccess(facts({ createdAt: daysAgo(8) }), NOW);
    expect(state.trialActive).toBe(false);
    expect(state.gated).toBe(true);
  });

  it('does not gate a member who completed every step', () => {
    const state = evaluateAccess(
      facts({
        createdAt: daysAgo(30),
        tourCompletedAt: daysAgo(29),
        hasBusiness: true,
        stripeChargesEnabled: true,
        onboardingMeetingBookedAt: daysAgo(28),
      }),
      NOW,
    );
    expect(state.onboardingComplete).toBe(true);
    expect(state.gated).toBe(false);
    expect(state.progress).toBe(1);
  });

  it('gates a member who did everything except connect Stripe', () => {
    const state = evaluateAccess(
      facts({
        createdAt: daysAgo(30),
        tourCompletedAt: daysAgo(29),
        hasBusiness: true,
        stripeChargesEnabled: false,
        onboardingMeetingBookedAt: daysAgo(28),
      }),
      NOW,
    );
    expect(state.gated).toBe(true);
    expect(state.progress).toBe(0.75);
  });

  it('honours an explicit completion stamp even if a step reads incomplete', () => {
    const state = evaluateAccess(
      facts({ createdAt: daysAgo(30), onboardingCompletedAt: daysAgo(20) }),
      NOW,
    );
    expect(state.onboardingComplete).toBe(true);
    expect(state.gated).toBe(false);
  });

  it('honours an unexpired admin exemption', () => {
    const state = evaluateAccess(
      facts({ createdAt: daysAgo(30), gateExemptUntil: new Date(NOW.getTime() + DAY) }),
      NOW,
    );
    expect(state.gated).toBe(false);
  });

  it('ignores an expired admin exemption', () => {
    const state = evaluateAccess(
      facts({ createdAt: daysAgo(30), gateExemptUntil: daysAgo(1) }),
      NOW,
    );
    expect(state.gated).toBe(true);
  });
});

describe('evaluateAccess — steps', () => {
  it('reports the four required steps in order', () => {
    const state = evaluateAccess(facts(), NOW);
    expect(state.steps.map((s) => s.id)).toEqual([
      'tour',
      'business',
      'payments',
      'meeting',
    ]);
  });
});
