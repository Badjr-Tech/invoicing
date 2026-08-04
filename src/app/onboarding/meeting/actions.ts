"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";

/**
 * Record that the member has booked their onboarding meeting.
 *
 * Self-reported: the scheduler (Calendly or Google) owns the real booking,
 * and wiring its webhook back to here is a later refinement. Marking it
 * manually is enough to move onboarding forward, and an admin sees the real
 * calendar either way.
 */
export async function markMeetingBooked() {
  const user = await requireUser();

  await db
    .update(users)
    .set({ onboardingMeetingBookedAt: new Date() })
    .where(eq(users.id, user.id));

  revalidatePath("/onboarding");
}
