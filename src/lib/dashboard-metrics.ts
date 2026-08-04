import { db } from '@/db';
import { invoices, transactions } from '@/db/schema';
import { and, eq, inArray, gte, ne } from 'drizzle-orm';
import { getOwnedBusinessIds } from '@/lib/tenancy';

/**
 * The Bird's Eye View numbers (spec §4.5).
 *
 * Three figures, above the fold, every login:
 *   1. What you need to get paid
 *   2. What your expenses actually are
 *   3. What is available for growth
 *
 * NOTE ON MONEY: the existing schema stores amounts as numeric(10,2) and
 * Drizzle hands them back as strings. Spec §5.8 requires integer minor units
 * before any Stripe work begins. Until that conversion happens, this module
 * parses to a Number for display only — it must not become the basis for a
 * fee calculation. src/lib/fees.ts is integer-only and takes cents.
 */

export interface BirdsEyeMetrics {
  /** Sum of unpaid, unarchived invoices. */
  owedToYou: number;
  /** Count of those invoices, and how many are more than 30 days old. */
  owedCount: number;
  overdueCount: number;
  /** Expenses over the trailing 30 days. */
  recentExpenses: number;
  /** Income over the trailing 30 days. */
  recentIncome: number;
  /** Income minus expenses over the same window. Can be negative. */
  availableForGrowth: number;
  /** False when the member has no business yet, so the UI can invite setup. */
  hasData: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** numeric(10,2) arrives as a string. Guard against null and bad parses. */
function toNumber(value: string | null): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function loadBirdsEyeMetrics(userId: number): Promise<BirdsEyeMetrics> {
  const businessIds = await getOwnedBusinessIds(userId);

  const empty: BirdsEyeMetrics = {
    owedToYou: 0,
    owedCount: 0,
    overdueCount: 0,
    recentExpenses: 0,
    recentIncome: 0,
    availableForGrowth: 0,
    hasData: false,
  };

  if (businessIds.length === 0) return empty;

  const now = Date.now();
  const thirtyDaysAgo = new Date(now - 30 * DAY_MS);

  const [outstanding, recent] = await Promise.all([
    db
      .select({ amount: invoices.amount, createdAt: invoices.createdAt })
      .from(invoices)
      .where(
        and(
          inArray(invoices.businessId, businessIds),
          ne(invoices.status, 'paid'),
          eq(invoices.isArchived, false),
        ),
      ),
    db
      .select({ amount: transactions.amount, type: transactions.type })
      .from(transactions)
      .where(
        and(
          inArray(transactions.businessId, businessIds),
          gte(transactions.date, thirtyDaysAgo),
        ),
      ),
  ]);

  const owedToYou = outstanding.reduce((sum, row) => sum + toNumber(row.amount), 0);
  const overdueCount = outstanding.filter(
    (row) => now - row.createdAt.getTime() > 30 * DAY_MS,
  ).length;

  const recentIncome = recent
    .filter((row) => row.type === 'income')
    .reduce((sum, row) => sum + toNumber(row.amount), 0);

  const recentExpenses = recent
    .filter((row) => row.type === 'expense')
    .reduce((sum, row) => sum + toNumber(row.amount), 0);

  return {
    owedToYou,
    owedCount: outstanding.length,
    overdueCount,
    recentIncome,
    recentExpenses,
    availableForGrowth: recentIncome - recentExpenses,
    hasData: true,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
