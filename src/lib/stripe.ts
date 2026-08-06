import Stripe from 'stripe';

/**
 * Stripe client singleton.
 *
 * Key mode is detected and surfaced loudly: the build order's hard gate says
 * no live charges until the fee, webhook and bookkeeping tests pass, and the
 * cheapest way to honour that is to make live mode impossible to miss.
 */

let client: Stripe | null = null;

export function stripeMode(): 'live' | 'test' | 'unconfigured' {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return 'unconfigured';
  return key.startsWith('sk_live_') ? 'live' : 'test';
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set.');
  }

  if (!client) {
    if (stripeMode() === 'live') {
      console.warn(
        '[stripe] LIVE key in use. Connected accounts created now are real and permanent; ' +
          'charges move real money. The launch gate (phases doc) requires passing tests first.',
      );
    }
    client = new Stripe(key);
  }

  return client;
}
