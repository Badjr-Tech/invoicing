import { SignJWT, jwtVerify } from 'jose';
import { SITE_URL } from '@/lib/site';

/**
 * Signed unsubscribe tokens.
 *
 * The link must work without a login — nobody signs in to unsubscribe — so
 * it carries a signed token instead of a session. Single purpose ('unsub'),
 * so a leaked unsubscribe token can never pass for a session, and long-lived,
 * because a dead unsubscribe link at the bottom of an old email is a
 * compliance problem.
 */

const PURPOSE = 'unsub';
const TTL = '365d';

function key(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set.');
  return new TextEncoder().encode(secret);
}

export async function makeUnsubscribeToken(userId: number): Promise<string> {
  return await new SignJWT({ purpose: PURPOSE })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(TTL)
    .sign(key());
}

/** The user id, or null for anything invalid, expired, or wrong-purpose. */
export async function verifyUnsubscribeToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
    if (payload.purpose !== PURPOSE || !payload.sub) return null;
    const id = Number(payload.sub);
    return Number.isInteger(id) ? id : null;
  } catch {
    return null;
  }
}

/** Human link for the email footer. */
export async function makeUnsubscribeUrl(userId: number): Promise<string> {
  return `${SITE_URL}/unsubscribe?token=${await makeUnsubscribeToken(userId)}`;
}

/** RFC 8058 one-click target for the List-Unsubscribe-Post header. */
export async function makeOneClickUrl(userId: number): Promise<string> {
  return `${SITE_URL}/api/unsubscribe?token=${await makeUnsubscribeToken(userId)}`;
}
