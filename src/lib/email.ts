/**
 * Transactional email via Brevo.
 *
 * Called over plain fetch rather than an SDK — it is one endpoint, and it
 * keeps a dependency out of the tree.
 *
 * Env:
 *   BREVO_API_KEY     required to actually send
 *   BREVO_FROM_EMAIL  the verified sender address
 *   BREVO_FROM_NAME   display name, defaults to "AGENCY"
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /**
   * Display name on the message, per send.
   *
   * This is how a member's invoice arrives as "Rivera Design Co" rather than
   * "AGENCY". Brevo takes the sender on each request, so it varies freely.
   */
  fromName?: string;
  /**
   * Sender address, per send. Only use an address on a domain that is
   * verified in Brevo — an unverified one is rejected outright, and a
   * mismatched one lands in spam even when it is accepted.
   */
  fromEmail?: string;
  /** Where replies go. Usually the member's own address. */
  replyTo?: { email: string; name?: string };
  /**
   * File attachments. Brevo caps the whole message near 10 MB, and base64
   * inflates content by about a third, so keep sources under roughly 7 MB.
   */
  attachments?: Array<{ name: string; contentBase64: string }>;
  /**
   * 'marketing' for anything a member did not directly trigger —
   * announcements, tips, campaigns. Requires recipientUserId: the send is
   * skipped when they have opted out, and the message carries a working
   * unsubscribe (List-Unsubscribe headers + a link the body must include).
   * 'transactional' (default) is exempt and must NOT carry unsubscribe —
   * opted-out members still get their password resets and receipts.
   */
  kind?: 'transactional' | 'marketing';
  /** Required when kind is 'marketing'. */
  recipientUserId?: number;
}

export type SendEmailResult =
  | { ok: true }
  | { ok: false; error: string; skipped?: boolean };

export async function sendEmail({
  to,
  subject,
  text,
  html,
  fromName,
  fromEmail: fromEmailOverride,
  replyTo,
  attachments,
  kind = 'transactional',
  recipientUserId,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;

  let unsubscribeHeaders: Record<string, string> = {};

  if (kind === 'marketing') {
    if (!recipientUserId) {
      return { ok: false, error: 'Marketing email requires recipientUserId.' };
    }

    // The opt-out flag is checked at the moment of sending — an unsubscribe
    // link that does not actually stop the next email is worse than none.
    const { db } = await import('@/db');
    const { users } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');
    const recipient = await db.query.users.findFirst({
      where: eq(users.id, recipientUserId),
    });
    if (!recipient) {
      return { ok: false, error: `No user ${recipientUserId} to send to.` };
    }
    if (recipient.isOptedOut) {
      return { ok: false, skipped: true, error: 'Recipient has unsubscribed.' };
    }

    const { makeOneClickUrl, makeUnsubscribeUrl } = await import('@/lib/unsubscribe');
    unsubscribeHeaders = {
      'List-Unsubscribe': `<${await makeOneClickUrl(recipientUserId)}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    };

    // Refuse to send marketing whose body has no visible unsubscribe link.
    if (!(html ?? text).includes('/unsubscribe')) {
      return {
        ok: false,
        error: `Marketing email must include an unsubscribe link in the body. Get one from makeUnsubscribeUrl(${recipientUserId}) — e.g. ${await makeUnsubscribeUrl(recipientUserId)}`,
      };
    }
  }

  if (!apiKey || !fromEmail) {
    // Not an error in development — the caller decides whether to fall back.
    return {
      ok: false,
      skipped: true,
      error: 'BREVO_API_KEY or BREVO_FROM_EMAIL is not set.',
    };
  }

  try {
    const response = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: {
          // Per-send overrides win, so a member's client sees the member's
          // business name rather than AGENCY.
          email: fromEmailOverride ?? fromEmail,
          name: fromName ?? process.env.BREVO_FROM_NAME ?? 'AGENCY',
        },
        to: [{ email: to }],
        subject,
        textContent: text,
        ...(html ? { htmlContent: html } : {}),
        ...(replyTo ? { replyTo } : {}),
        ...(Object.keys(unsubscribeHeaders).length ? { headers: unsubscribeHeaders } : {}),
        ...(attachments?.length
          ? {
              attachment: attachments.map((file) => ({
                name: file.name,
                content: file.contentBase64,
              })),
            }
          : {}),
      }),
    });

    if (!response.ok) {
      // Brevo puts the reason in the body; the status alone is not enough
      // to debug a rejected sender or a bad key.
      const detail = await response.text().catch(() => '');
      return {
        ok: false,
        error: `Brevo responded ${response.status}: ${detail.slice(0, 300)}`,
      };
    }

    return { ok: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { ok: false, error: `Failed to reach Brevo: ${message}` };
  }
}
