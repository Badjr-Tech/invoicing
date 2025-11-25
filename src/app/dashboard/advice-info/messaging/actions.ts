'use server';

import { db } from "@/db";
import { getSession, SessionPayload } from "@/app/login/actions";
import { revalidatePath } from "next/cache";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { helpRequests, referrals } from "@/db/schema"; // Assuming these tables will be added to schema.ts

type FormState = {
  message: string;
  error: string;
} | undefined;

// Helper function to get user ID from session
async function getUserIdFromSession(): Promise<number | undefined> {
  const session: SessionPayload | null = await getSession();
  return session?.user?.id;
}

// --- Help Request Actions ---
export async function submitHelpRequest(prevState: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return { message: "", error: "User not authenticated." };
  }

  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;

  if (!subject || !description) {
    return { message: "", error: "Subject and description are required." };
  }

  try {
    await db.insert(helpRequests).values({
      userId,
      subject,
      description,
      status: 'pending', // Default status
    });

    revalidatePath("/dashboard/advice-info/messaging");
    return { message: "Help request submitted successfully!", error: "" };
  } catch (error) {
    console.error("Error submitting help request:", error);
    let errorMessage = "Failed to submit help request.";
    if (error instanceof Error) {
      errorMessage = `Failed to submit help request: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}

export async function getHelpRequests(userId: number): Promise<InferSelectModel<typeof helpRequests>[]> {
  try {
    const requests = await db.query.helpRequests.findMany({
      where: (helpRequests, { eq }) => eq(helpRequests.userId, userId),
      orderBy: (helpRequests, { desc }) => [desc(helpRequests.timestamp)],
    });
    return requests;
  } catch (error) {
    console.error("Error fetching help requests:", error);
    return [];
  }
}

// --- Referral Actions ---
export async function getReferralsSentByAdmin(): Promise<InferSelectModel<typeof referrals>[]> {
  try {
    // Assuming adminId is 1 for now, or can be fetched from session
    const adminId = 1; // Placeholder for admin ID
    const adminReferrals = await db.query.referrals.findMany({
      where: (referrals, { eq }) => eq(referrals.senderId, adminId), // Assuming senderId is admin
      orderBy: (referrals, { desc }) => [desc(referrals.timestamp)],
    });
    return adminReferrals;
  } catch (error) {
    console.error("Error fetching admin referrals:", error);
    return [];
  }
}
