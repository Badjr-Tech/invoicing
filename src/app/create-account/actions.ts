"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";

export type FormState = {
  message: string;
  error: string;
} | undefined;

export async function createAccount(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    console.log("Account created successfully!");
    return { message: "Account created successfully!", error: "" };
  } catch (error: unknown) {
    console.error("Error creating account:", error);
    let errorMessage = "Failed to create account.";
    if (error instanceof Error) {
      errorMessage = `Failed to create account: ${error.message}`;
    }
    return { message: "", error: errorMessage };
  }
}
