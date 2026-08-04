import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  SESSION_RENEW_THRESHOLD_MS,
  decrypt,
  encrypt,
  sessionCookieOptions,
} from "@/lib/session-core";
import { isGated } from "@/lib/access-edge";

/**
 * Routes under /api that are intentionally reachable without a session.
 * Everything else matched below requires one.
 */
const PUBLIC_API_PREFIXES: string[] = [];

/** Methods that cannot change state, so they never trigger the gate check. */
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isPublicApi(pathname: string) {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");

  if (isApi && isPublicApi(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await decrypt(token) : null;

  if (!session?.user) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear a stale or tampered cookie so the user is not stuck in a loop.
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  // Admin surface is gated here, not by hiding links in the sidebar.
  if (pathname.startsWith("/dashboard/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // A member past the trial with onboarding unfinished can still look at
  // everything — that is how they see what they are signing up for. What they
  // cannot do is change anything.
  //
  // Only REST routes are gated here. Server actions cannot be gated by method:
  // they are all POSTs, including read-only ones like the sidebar's session
  // and product lookups, so blocking POST to /dashboard blanks the UI for the
  // very member the gate is trying to persuade. Mutating server actions call
  // requireUnlocked() individually instead.
  //
  // Onboarding routes are exempt either way: those writes are how a member
  // gets out of the gate in the first place.
  const isWrite = !SAFE_METHODS.has(request.method);
  const isOnboardingRoute = pathname.startsWith("/api/onboarding");

  if (isApi && isWrite && !isOnboardingRoute && (await isGated(session.user.id))) {
    return NextResponse.json(
      { error: "Finish setting up your account to make changes." },
      { status: 403 },
    );
  }

  const response = NextResponse.next();

  // Slide the session forward for active users so they are not logged out
  // mid-task, while keeping an absolute idle timeout.
  const expiresAtMs = (session.exp ?? 0) * 1000;
  if (expiresAtMs - Date.now() < SESSION_RENEW_THRESHOLD_MS) {
    const expires = new Date(Date.now() + SESSION_DURATION_MS);
    const renewed = await encrypt({ user: session.user }, expires);
    response.cookies.set(SESSION_COOKIE, renewed, sessionCookieOptions(expires));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/api/:path*"],
};
