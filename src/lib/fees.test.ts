import { describe, expect, it } from 'vitest';
import { annualFeeCents, bandFor, calculateFee } from './fees';

const DOLLARS = (n: number) => Math.round(n * 100);

describe('bandFor', () => {
  it('places revenue in the flat band its total lands in', () => {
    expect(bandFor(0)).toBe(1);
    expect(bandFor(DOLLARS(50_000))).toBe(1);
    expect(bandFor(DOLLARS(99_999.99))).toBe(1);
    expect(bandFor(DOLLARS(100_000))).toBe(2);
    expect(bandFor(DOLLARS(250_000))).toBe(2);
    expect(bandFor(DOLLARS(499_999.99))).toBe(2);
    expect(bandFor(DOLLARS(500_000))).toBe(3);
    expect(bandFor(DOLLARS(1_000_000))).toBe(3);
  });
});

describe('annualFeeCents — spec §2.4 worked table', () => {
  const cases: Array<[number, number]> = [
    [100_000, 7_000],
    [120_000, 7_000], // floor engaged: flat would be $6,000
    [140_000, 7_000],
    [200_000, 10_000],
    [600_000, 25_000], // floor engaged: flat would be $18,000
    [833_000, 25_000],
    [1_000_000, 30_000],
  ];

  it.each(cases)('$%d revenue bills $%d', (revenue, expected) => {
    expect(annualFeeCents(DOLLARS(revenue))).toBe(DOLLARS(expected));
  });

  it('never lets the fee drop as revenue grows', () => {
    let previous = 0;
    for (let revenue = 0; revenue <= 1_200_000; revenue += 5_000) {
      const fee = annualFeeCents(DOLLARS(revenue));
      expect(fee).toBeGreaterThanOrEqual(previous);
      previous = fee;
    }
  });
});

describe('calculateFee — bands in isolation', () => {
  const invoice = DOLLARS(500);

  it('bills 7% in band 1', () => {
    const fee = calculateFee(invoice, DOLLARS(50_000), 'ach');
    expect(fee.band).toBe(1);
    expect(fee.totalFee).toBe(DOLLARS(35));
    expect(fee.floorEngaged).toBe(false);
  });

  it('bills 5% in band 2 when the floor is not engaged', () => {
    const fee = calculateFee(invoice, DOLLARS(250_000), 'ach');
    expect(fee.band).toBe(2);
    expect(fee.totalFee).toBe(DOLLARS(25));
    expect(fee.floorEngaged).toBe(false);
  });

  it('bills 3% in band 3 when the floor is not engaged', () => {
    const fee = calculateFee(invoice, DOLLARS(1_000_000), 'ach');
    expect(fee.band).toBe(3);
    expect(fee.totalFee).toBe(DOLLARS(15));
    expect(fee.floorEngaged).toBe(false);
  });
});

describe('calculateFee — band boundaries exactly', () => {
  it('charges the band 1 ceiling rate at exactly $100,000', () => {
    const fee = calculateFee(DOLLARS(500), DOLLARS(100_000), 'ach');
    // Flat 5% would be $25; the floor holds the effective rate at 7%.
    expect(fee.totalFee).toBe(DOLLARS(35));
    expect(fee.effectiveRateBp).toBe(700);
  });

  it('charges the band 2 ceiling rate at exactly $500,000', () => {
    const fee = calculateFee(DOLLARS(500), DOLLARS(500_000), 'ach');
    // Flat 3% would be $15; the floor holds the effective rate at 5%.
    expect(fee.totalFee).toBe(DOLLARS(25));
    expect(fee.effectiveRateBp).toBe(500);
  });
});

describe('calculateFee — boundary floor engaging and disengaging', () => {
  it('engages just past a boundary and holds the fee flat', () => {
    const fee = calculateFee(DOLLARS(500), DOLLARS(120_000), 'ach');
    expect(fee.floorEngaged).toBe(true);
    // $7,000 annual on $120,000 revenue is an effective 5.833%.
    expect(fee.effectiveRateBp).toBe(583);
    expect(fee.totalFee).toBe(2917); // $29.17
  });

  it('disengages once the band rate catches up', () => {
    const fee = calculateFee(DOLLARS(500), DOLLARS(140_000), 'ach');
    expect(fee.floorEngaged).toBe(false);
    expect(fee.effectiveRateBp).toBe(500);
    expect(fee.totalFee).toBe(DOLLARS(25));
  });

  it('engages across the whole of band 3 below $833,333', () => {
    expect(calculateFee(DOLLARS(500), DOLLARS(600_000), 'ach').floorEngaged).toBe(true);
    expect(calculateFee(DOLLARS(500), DOLLARS(900_000), 'ach').floorEngaged).toBe(false);
  });
});

describe('calculateFee — ACH versus card on identical input', () => {
  it('adds 1.5% of the fee base for card and nothing for ACH', () => {
    const base = DOLLARS(500);
    const ttm = DOLLARS(50_000);

    const ach = calculateFee(base, ttm, 'ach');
    const card = calculateFee(base, ttm, 'card');

    expect(ach.cardContribution).toBe(0);
    expect(ach.totalFee).toBe(DOLLARS(35)); // 7.0%
    expect(card.cardContribution).toBe(DOLLARS(7.5));
    expect(card.totalFee).toBe(DOLLARS(42.5)); // 8.5%
    expect(card.platformFee).toBe(ach.platformFee);
  });

  it('keeps the card contribution at 1.5% in the top band', () => {
    const card = calculateFee(DOLLARS(500), DOLLARS(1_000_000), 'card');
    expect(card.totalFee).toBe(DOLLARS(22.5)); // 3% + 1.5%
  });
});

describe('calculateFee — edge cases', () => {
  it('returns zero for a fully fee-exempt invoice', () => {
    const fee = calculateFee(0, DOLLARS(250_000), 'ach');
    expect(fee.totalFee).toBe(0);
    expect(fee.platformFee).toBe(0);
  });

  it('bills band 1 for a member with no trailing revenue', () => {
    const fee = calculateFee(DOLLARS(500), 0, 'ach');
    expect(fee.band).toBe(1);
    expect(fee.totalFee).toBe(DOLLARS(35));
  });

  it('rounds fractional cents half up and returns an integer', () => {
    // 7% of $10.05 is 70.35 cents.
    const fee = calculateFee(1005, DOLLARS(50_000), 'ach');
    expect(Number.isInteger(fee.totalFee)).toBe(true);
    expect(fee.totalFee).toBe(70);

    // 7% of $10.08 is 70.56 cents.
    expect(calculateFee(1008, DOLLARS(50_000), 'ach').totalFee).toBe(71);
  });

  it('keeps the fee strictly less than the charge amount', () => {
    // Stripe rejects an application fee equal to or above the charge.
    const fee = calculateFee(100, DOLLARS(50_000), 'ach', 5);
    expect(fee.totalFee).toBeLessThan(5);
    expect(fee.totalFee).toBe(4);
  });

  it('never returns a negative fee for a zero charge', () => {
    const fee = calculateFee(0, 0, 'ach', 0);
    expect(fee.totalFee).toBe(0);
  });

  it('rejects non-integer and negative input', () => {
    expect(() => calculateFee(10.5, 0, 'ach')).toThrow();
    expect(() => calculateFee(-1, 0, 'ach')).toThrow();
    expect(() => calculateFee(100, -1, 'ach')).toThrow();
  });
});

describe('calculateFee — per-transaction fees reconcile to the annual figure', () => {
  /**
   * Billing per transaction cannot sum to the annual figure exactly: each
   * charge rounds to a whole cent, so the year drifts by up to one cent per
   * invoice. At $120,000 across 120 invoices the effective rate is 5.8333%,
   * each $1,000 invoice rounds 5833.33 down to 5833, and the year lands 40¢
   * under $7,000.
   *
   * That is acceptable and in AGENCY's disfavour (never overcharges). Closing
   * it entirely would require carrying the remainder between invoices. This
   * test pins the drift so it cannot silently grow.
   */
  it('sums to within one cent per invoice of the annual fee', () => {
    const ttm = DOLLARS(120_000); // floor engaged
    const invoice = DOLLARS(1_000);
    const count = 120; // 120 × $1,000 = $120,000

    const total = Array.from({ length: count }).reduce<number>(
      (sum) => sum + calculateFee(invoice, ttm, 'ach').totalFee,
      0,
    );

    const annual = annualFeeCents(ttm);
    expect(total).toBeLessThanOrEqual(annual);
    expect(annual - total).toBeLessThanOrEqual(count);
  });
});
