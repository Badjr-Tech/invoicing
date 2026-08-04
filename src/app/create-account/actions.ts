"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export type FormState = {
  message: string;
  error: string;
} | undefined;

const MIN_PASSWORD_LENGTH = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createAccount(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = (formData.get("name") as string ?? "").trim();
  const phone = (formData.get("phone") as string ?? "").trim();
  const email = (formData.get("email") as string ?? "").trim().toLowerCase();
  const password = formData.get("password") as string ?? "";
  const confirmPassword = formData.get("confirmPassword") as string ?? "";

  const fail = (error: string): FormState => ({ message: "", error });

  if (!name || !phone || !email || !password) {
    return fail("All fields are required.");
  }

  if (!EMAIL_PATTERN.test(email)) {
    return fail("Enter a valid email address.");
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return fail(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  // Length is the property that actually matters, but a password that is one
  // repeated character passes a length check while being trivially guessable.
  if (new Set(password).size < 5) {
    return fail("Password is too simple. Mix in more different characters.");
  }

  if (confirmPassword && password !== confirmPassword) {
    return fail("Passwords do not match.");
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return fail("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    return { message: "Account created successfully!", error: "" };
  } catch (error: unknown) {
    // Log the detail server-side; do not hand database errors to the client.
    console.error("Error creating account:", error);
    return fail("Failed to create account. Please try again.");
  }
}
