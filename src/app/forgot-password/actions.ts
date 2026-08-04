"use server";

import { createHash, randomBytes } from "crypto";
import { db } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";

export type FormState = {
  message: string;
  error: string;
} | undefined;

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Reset tokens are stored hashed.
 *
 * The database holds only the hash, so a leaked table cannot be used to take
 * over accounts — the same reasoning as password hashing. SHA-256 without a
 * salt is right here: the token is already 32 bytes of entropy, so there is
 * nothing to brute force and nothing for a rainbow table to precompute.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function forgotPassword(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = (formData.get("email") as string ?? "").trim().toLowerCase();

  // Always the same answer, whether or not the address exists — otherwise
  // this endpoint tells an attacker who has an account.
  const genericResponse: FormState = {
    message:
      "If an account with this email exists, a password reset link has been sent.",
    error: "",
  };

  if (!email) {
    return { message: "", error: "Enter your email address." };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) return genericResponse;

    // One live token per user: issuing a new link invalidates the old one.
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));

    const token = randomBytes(32).toString("hex");

    await db.insert(passwordResetTokens).values({
      token: hashToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const result = await sendEmail({
      to: email,
      subject: "Reset your AGENCY password",
      text: [
        `Hi ${user.name?.split(" ")[0] ?? "there"},`,
        "",
        "Someone asked to reset the password on your AGENCY account.",
        "Open this link within the next hour to choose a new one:",
        "",
        resetUrl,
        "",
        "If that wasn't you, you can ignore this email. Your password stays as it is.",
      ].join("\n"),
    });

    if (!result.ok) {
      // Without mail configured the flow still works end to end in
      // development; the link goes to the server log instead of an inbox.
      if (result.skipped) {
        console.warn(
          `[forgot-password] Email not configured. Reset link for ${email}: ${resetUrl}`,
        );
      } else {
        console.error(`[forgot-password] ${result.error}`);
      }
    }

    return genericResponse;
  } catch (error: unknown) {
    console.error("Error processing forgot password request:", error);
    // Still generic: a failure here must not reveal whether the account exists.
    return genericResponse;
  }
}
