import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  SESSION_RENEW_THRESHOLD_MS,
  decrypt,
  encrypt,
  sessionCookieOptions,
} from "@/lib/session-core";

/**
 * Routes under /api that are intentionally reachable without a session.
 * Everything else matched below requires one.
 */
const PUBLIC_API_PREFIXES: string[] = [];

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
