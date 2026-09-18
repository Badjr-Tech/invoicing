"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import {
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  encrypt,
  sessionCookieOptions,
  toSessionUser,
} from "@/lib/session-core";
import { getSession as readSession } from "@/lib/session";

// Everything exported from a "use server" file is a callable endpoint, so this
// file exports only what a client is allowed to invoke. Token minting lives in
// @/lib/session-core and is never re-exported here.

export type { SessionPayload, SessionUser } from "@/lib/session-core";

export type FormState = {
  error: string;
} | undefined;

export async function login(prevState: FormState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Invalid email or password" };
  }

  // Ten tries a minute per IP: room for typos, none for credential stuffing.
  if (await rateLimited("login", 10, 60_000)) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  // Compare against a dummy hash when the user is absent so the response time
  // does not reveal whether the address is registered.
  const hash = user?.password ?? "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
  const isPasswordValid = await bcrypt.compare(password, hash);

  if (!user || !isPasswordValid) {
    return { error: "Invalid email or password" };
  }

  try {
    const expires = new Date(Date.now() + SESSION_DURATION_MS);
    const token = await encrypt({ user: toSessionUser(user) }, expires);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, sessionCookieOptions(expires));
  } catch (error: unknown) {
    console.error("Login error:", error);
    return { error: "An unexpected error occurred during login." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function getSession() {
  return await readSession();
}

/** Server action used by client components that need the current session. */
export async function fetchSession() {
  return await readSession();
}
