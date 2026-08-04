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
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;

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
