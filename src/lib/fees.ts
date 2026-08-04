/**
 * AGENCY platform fee calculation. Spec §2.2, §2.4, §8.1.
 *
 * Pure module: no database, no network, no framework. All arithmetic is in
 * integer minor units (cents). No floating point anywhere — every rate is
 * basis points and every division rounds explicitly.
 */

export type PaymentMethod = 'ach' | 'card';

/** Basis points, i.e. hundredths of a percent. 700 bp = 7%. */
const BAND_1_RATE_BP = 700; // 7%
const BAND_2_RATE_BP = 500; // 5%
const BAND_3_RATE_BP = 300; // 3%

/** Card payments contribute an extra 1.5% of the fee base (spec §2.3). */
export const CARD_CONTRIBUTION_BP = 150;

const DOLLAR = 100;
const BAND_2_THRESHOLD_CENTS = 100_000 * DOLLAR; // $100,000
const BAND_3_THRESHOLD_CENTS = 500_000 * DOLLAR; // $500,000

export type Band = 1 | 2 | 3;

export interface FeeBreakdown {
  /** The band the member's trailing revenue lands in. */
  band: Band;
  /** The band's headline rate in basis points, before the boundary floor. */
  bandRateBp: number;
  /**
   * The rate actually billed, in basis points, after the boundary floor.
   * Equals bandRateBp unless the floor is engaged. Reporting only — the fee
   * is computed from exact integers, not by re-applying this.
   */
  effectiveRateBp: number;
  /** The band portion of the fee, in cents. */
  platformFee: number;
  /** The card surcharge portion, in cents. Zero for ACH. */
  cardContribution: number;
  /** platformFee + cardContribution, in cents. This is the application fee. */
  totalFee: number;
  /** True when the boundary floor raised the fee above the flat band rate. */
  floorEngaged: boolean;
}

/**
 * The band for a given trailing-twelve-month revenue.
 *
 * Bands are FLAT, not marginal: the entire revenue bills at the single rate
 * its total lands in. Boundaries are inclusive of the lower band's ceiling;
 * because the boundary floor applies at exactly those points, the choice does
 * not change any fee.
 */
export function bandFor(ttmRevenueCents: number): Band {
  if (ttmRevenueCents < BAND_2_THRESHOLD_CENTS) return 1;
  if (ttmRevenueCents < BAND_3_THRESHOLD_CENTS) return 2;
  return 3;
}

function rateBpForBand(band: Band): number {
  if (band === 1) return BAND_1_RATE_BP;
  if (band === 2) return BAND_2_RATE_BP;
  return BAND_3_RATE_BP;
}

/**
 * The previous band's ceiling in cents — the most a member in the band below
 * could ever have paid. Spec §2.4.
 *
 *   band 1: $0
 *   band 2: $7,000   (7% of $100,000)
 *   band 3: $25,000  (5% of $500,000)
 */
function previousBandCeilingCents(band: Band): number {
  if (band === 1) return 0;
  if (band === 2) return mulRateBp(BAND_2_THRESHOLD_CENTS, BAND_1_RATE_BP);
  return mulRateBp(BAND_3_THRESHOLD_CENTS, BAND_2_RATE_BP);
}

/** amount × rate, rounding half up, in integer cents. */
function mulRateBp(amountCents: number, rateBp: number): number {
  return divRoundHalfUp(amountCents * rateBp, 10_000);
}

/** Integer division rounding half away from zero. Inputs are non-negative here. */
function divRoundHalfUp(numerator: number, denominator: number): number {
  return Math.floor((numerator + Math.floor(denominator / 2)) / denominator);
}

/**
 * The member's annual fee at their current trailing revenue, with the
 * boundary floor applied. Spec §2.4:
 *
 *   fee = max(band_rate × revenue, previous_band_ceiling)
 *
 * Never charge less than the band below could have charged, so a member's fee
 * plateaus at each boundary instead of dropping as they grow.
 */
export function annualFeeCents(ttmRevenueCents: number): number {
  const band = bandFor(ttmRevenueCents);
  const flat = mulRateBp(ttmRevenueCents, rateBpForBand(band));
  return Math.max(flat, previousBandCeilingCents(band));
}

/**
 * Calculate the application fee for one payment.
 *
 * The boundary floor is an annual concept, so it is applied by deriving the
 * member's effective annual rate and billing that rate per transaction
 * (spec §3.3, the recommended resolution of open decision #1). The exact
 * ratio is carried through the multiplication rather than being rounded into
 * a rate first, so per-transaction fees sum back to the annual figure.
 *
 * @param feeBaseCents      Invoice total minus fee-exempt lines, in cents.
 * @param ttmRevenueCents   Trailing-twelve-month processed revenue, in cents.
 * @param method            Payment method of the ACTUAL charge, not the
 *                          member's current toggle (spec §4.3).
 * @param chargeAmountCents Total charge, if it differs from the fee base.
 *                          Stripe requires the fee to be strictly less.
 */
export function calculateFee(
  feeBaseCents: number,
  ttmRevenueCents: number,
  method: PaymentMethod,
  chargeAmountCents: number = feeBaseCents,
): FeeBreakdown {
  if (!Number.isInteger(feeBaseCents) || feeBaseCents < 0) {
    throw new Error('feeBaseCents must be a non-negative integer');
  }
  if (!Number.isInteger(ttmRevenueCents) || ttmRevenueCents < 0) {
    throw new Error('ttmRevenueCents must be a non-negative integer');
  }

  const band = bandFor(ttmRevenueCents);
  const bandRateBp = rateBpForBand(band);
  const annual = annualFeeCents(ttmRevenueCents);
  const flatAnnual = mulRateBp(ttmRevenueCents, bandRateBp);
  const floorEngaged = annual > flatAnnual;

  // With no trailing revenue the member is in band 1 and the floor is $0, so
  // the flat rate applies directly and there is no ratio to derive.
  const platformFee =
    ttmRevenueCents === 0
      ? mulRateBp(feeBaseCents, bandRateBp)
      : divRoundHalfUp(feeBaseCents * annual, ttmRevenueCents);

  const cardContribution =
    method === 'card' ? mulRateBp(feeBaseCents, CARD_CONTRIBUTION_BP) : 0;

  const rawTotal = platformFee + cardContribution;

  // Stripe rejects an application fee that is not less than the charge.
  const ceiling = Math.max(chargeAmountCents - 1, 0);
  const totalFee = Math.min(rawTotal, ceiling);

  const effectiveRateBp =
    ttmRevenueCents === 0
      ? bandRateBp
      : divRoundHalfUp(annual * 10_000, ttmRevenueCents);

  return {
    band,
    bandRateBp,
    effectiveRateBp,
    platformFee: Math.min(platformFee, ceiling),
    cardContribution: totalFee - Math.min(platformFee, ceiling),
    totalFee,
    floorEngaged,
  };
}
