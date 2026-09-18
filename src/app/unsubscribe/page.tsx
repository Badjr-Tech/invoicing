import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description: "Stop receiving non-essential email from AGENCY.",
};

/**
 * The human unsubscribe page, linked from every marketing email footer.
 *
 * Rendering the page does NOT unsubscribe — email scanners prefetch links,
 * and a prefetch must never opt someone out. The flag flips on the button
 * press (a POST), same as the one-click API.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; done?: string }>;
}) {
  const { token, done } = await searchParams;
  const userId = token ? await verifyUnsubscribeToken(token) : null;

  const user =
    userId !== null
      ? await db.query.users.findFirst({ where: eq(users.id, userId) })
      : null;

  async function unsubscribe() {
    "use server";
    if (!token) return;
    const id = await verifyUnsubscribeToken(token);
    if (id === null) return;
    await db.update(users).set({ isOptedOut: true }).where(eq(users.id, id));
    revalidatePath("/unsubscribe");
  }

  async function resubscribe() {
    "use server";
    if (!token) return;
    const id = await verifyUnsubscribeToken(token);
    if (id === null) return;
    await db.update(users).set({ isOptedOut: false }).where(eq(users.id, id));
    revalidatePath("/unsubscribe");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-clay-50 px-6 text-center">
      <Image src="/agency-logo.svg" alt="" width={56} height={56} priority />

      <div className="mt-8 w-full max-w-md rounded-card border border-clay-200 bg-white p-8 shadow-card">
        {!user ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-clay-800">
              This link has expired.
            </h1>
            <p className="mt-3 text-clay-600">
              Use the unsubscribe link from a more recent email, or manage
              email preferences in your{" "}
              <Link href="/dashboard/settings" className="text-sage-700 underline underline-offset-4">
                settings
              </Link>.
            </p>
          </>
        ) : user.isOptedOut ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-clay-800">
              You&apos;re unsubscribed.
            </h1>
            <p className="mt-3 text-clay-600">
              No more announcements or tips to <strong>{user.email}</strong>.
              You&apos;ll still get essential account email — password resets,
              receipts, invoices you send.
            </p>
            <form action={resubscribe} className="mt-6">
              <button
                type="submit"
                className="rounded-control border border-clay-200 bg-white px-5 py-2.5 text-sm font-semibold text-clay-700 transition hover:border-sage-300"
              >
                Undo — keep sending them
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-clay-800">
              Unsubscribe from AGENCY emails?
            </h1>
            <p className="mt-3 text-clay-600">
              <strong>{user.email}</strong> will stop receiving announcements
              and tips. Essential account email — password resets, receipts —
              keeps working.
            </p>
            <form action={unsubscribe} className="mt-6">
              <button
                type="submit"
                className="rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-700"
              >
                Unsubscribe
              </button>
            </form>
          </>
        )}
      </div>

      <Link href="/" className="mt-6 text-sm text-clay-600 hover:text-clay-800">
        Back to AGENCY
      </Link>
    </div>
  );
}
