import { db } from "@/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Tenant scoping helpers.
 *
 * A first step toward the data access layer in spec §7.2: callers ask "which
 * businesses may this user touch" rather than hand-rolling the filter, so the
 * check cannot be forgotten. The full compile-time-safe DAL replaces this.
 */

/** IDs of every business owned by the user. Empty when they own none. */
export async function getOwnedBusinessIds(userId: number): Promise<number[]> {
  const rows = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(eq(businesses.userId, userId));
  return rows.map((row) => row.id);
}

/** True when the user owns the given business. Admins are not special-cased here. */
export async function ownsBusiness(
  userId: number,
  businessId: number,
): Promise<boolean> {
  const ids = await getOwnedBusinessIds(userId);
  return ids.includes(businessId);
}
