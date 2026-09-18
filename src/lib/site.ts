/**
 * The canonical site origin.
 *
 * Set NEXT_PUBLIC_APP_URL in Vercel when a custom domain lands; until then
 * the deployment URL keeps sitemap, canonical tags, OG URLs and email links
 * consistent instead of half the site claiming localhost.
 *
 * Empty and malformed values fall back rather than crash: the variable was
 * once set to "" in Vercel, and `new URL("")` took the whole build down.
 */
function resolveSiteUrl(): string {
  const fallback = 'https://invoicing-eight-lime.vercel.app';
  const candidate = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!candidate) return fallback;
  try {
    return new URL(candidate).origin;
  } catch {
    console.warn(`[site] NEXT_PUBLIC_APP_URL is not a valid URL (${JSON.stringify(candidate)}); using ${fallback}`);
    return fallback;
  }
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = 'AGENCY';

export const SITE_DESCRIPTION =
  'One place for the whole business — invoicing, payments, bookkeeping, budgeting, contracts, classes and real people to talk to. By DakJen Creative LLC.';

/** Public contact shown on legal pages. CONFIRM WITH DAKOTAH before launch. */
export const CONTACT_EMAIL = 'dakjenenterprises@gmail.com';
