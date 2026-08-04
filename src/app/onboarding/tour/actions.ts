"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";

/** Mark the guided walkthrough as finished for the signed-in member. */
export async function completeTour() {
  const user = await requireUser();

  await db
    .update(users)
    .set({ tourCompletedAt: new Date() })
    .where(eq(users.id, user.id));

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
}
