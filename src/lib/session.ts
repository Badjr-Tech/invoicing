import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  decrypt,
  type SessionPayload,
  type SessionUser,
} from "@/lib/session-core";

export * from "@/lib/session-core";

/**
 * Read the session from the request cookies.
 *
 * Returns null when the cookie is absent, expired, or fails verification —
 * callers redirect rather than surfacing a 500.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await decrypt(token);
  if (!payload?.user) return null;
  return payload;
}

/**
 * The authenticated user, or a redirect to /login.
 *
 * Use this in server components and server actions instead of reading the
 * session directly, so no caller can forget the null check.
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

/** As requireUser, but also requires the admin role. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}

/**
 * The authenticated user for route handlers, or null.
 *
 * Route handlers return a 401 rather than redirecting, so they use this
 * instead of requireUser.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}
