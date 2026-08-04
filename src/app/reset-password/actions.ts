"use server";

import { createHash } from "crypto";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { passwordResetTokens, users } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

export type FormState = {
  message: string;
  error: string;
} | undefined;

const MIN_PASSWORD_LENGTH = 12;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function resetPassword(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = (formData.get("token") as string ?? "").trim();
  const password = formData.get("password") as string ?? "";
  const confirmPassword = formData.get("confirmPassword") as string ?? "";

  const fail = (error: string): FormState => ({ message: "", error });

  if (!token) {
    return fail("This reset link is invalid. Request a new one.");
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return fail(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  if (new Set(password).size < 5) {
    return fail("Password is too simple. Mix in more different characters.");
  }

  if (password !== confirmPassword) {
    return fail("Passwords do not match.");
  }

  try {
    // Look up by hash and require an unexpired row, so a stale or forged
    // token finds nothing.
    const record = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.token, hashToken(token)),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    });

    if (!record) {
      return fail("This reset link has expired or already been used. Request a new one.");
    }

    await db
      .update(users)
      .set({ password: await bcrypt.hash(password, 12) })
      .where(eq(users.id, record.userId));

    // Single use: consume the token whether or not the user logs in next.
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, record.id));

    return { message: "Your password has been reset. You can sign in now.", error: "" };
  } catch (error: unknown) {
    console.error("Error resetting password:", error);
    return fail("Something went wrong. Please request a new reset link.");
  }
}
