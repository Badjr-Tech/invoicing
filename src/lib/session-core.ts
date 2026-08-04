import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { InferSelectModel } from "drizzle-orm";
import type { users } from "@/db/schema";

// Imported by middleware, so this file must stay edge-safe: jose and types
// only. No database client, no bcrypt, no next/headers, no Node-only APIs.

export const SESSION_COOKIE = "session";

/** Absolute session lifetime. Middleware slides it forward while the user is active. */
export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

/** Renew the cookie once less than this much time is left. */
export const SESSION_RENEW_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour

type UserRow = InferSelectModel<typeof users>;

/**
 * The user fields carried in the session cookie.
 *
 * A JWT is signed, not encrypted — anything in here is readable by the
 * cookie holder. `password` is deliberately excluded and must never be added.
 *
 * Timestamps are excluded too, for two reasons: JSON has no date type, so
 * they would arrive back as strings while the type claimed `Date`; and
 * onboarding state changes without a fresh login (a Stripe webhook can flip
 * it), so a cookie must never be what decides whether the tools are unlocked.
 * Read those from the database via loadAccessState instead.
 */
export type SessionUser = Omit<
  UserRow,
  | "password"
  | "createdAt"
  | "tourCompletedAt"
  | "onboardingCompletedAt"
  | "onboardingMeetingBookedAt"
  | "gateExemptUntil"
>;

export interface SessionPayload extends JWTPayload {
  user?: SessionUser;
}

function getKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }
  return new TextEncoder().encode(secret);
}

/** Strip everything that must not leave the server, notably the password hash. */
export function toSessionUser(user: UserRow): SessionUser {
  const {
    password: _password,
    createdAt: _createdAt,
    tourCompletedAt: _tourCompletedAt,
    onboardingCompletedAt: _onboardingCompletedAt,
    onboardingMeetingBookedAt: _onboardingMeetingBookedAt,
    gateExemptUntil: _gateExemptUntil,
    ...safe
  } = user;
  return safe;
}

export async function encrypt(payload: SessionPayload, expires: Date) {
  return await new SignJWT({ user: payload.user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(getKey());
}

/**
 * Verify a session token. Returns null for anything invalid, expired, or
 * tampered with, so callers can redirect instead of throwing a 500.
 */
export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(expires: Date) {
  return {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function isAdmin(session: SessionPayload | null): boolean {
  return session?.user?.role === "admin";
}
