import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';

/**
 * RFC 8058 one-click unsubscribe.
 *
 * Mail clients POST here when the user taps their native "Unsubscribe"
 * button, driven by the List-Unsubscribe-Post header. No session — the
 * signed token is the authorization. POST-only by design: link scanners
 * prefetch GETs, and a prefetch must never opt someone out.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) return new NextResponse('Missing token', { status: 400 });

  const userId = await verifyUnsubscribeToken(token);
  if (userId === null) return new NextResponse('Invalid token', { status: 400 });

  await db.update(users).set({ isOptedOut: true }).where(eq(users.id, userId));
  return new NextResponse('Unsubscribed', { status: 200 });
}
