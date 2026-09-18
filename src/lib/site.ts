/**
 * The canonical site origin.
 *
 * Set NEXT_PUBLIC_APP_URL in Vercel when a custom domain lands; until then
 * the deployment URL keeps sitemap, canonical tags, OG URLs and email links
 * consistent instead of half the site claiming localhost.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://invoicing-eight-lime.vercel.app';

export const SITE_NAME = 'AGENCY';

export const SITE_DESCRIPTION =
  'One place for the whole business — invoicing, payments, bookkeeping, budgeting, contracts, classes and real people to talk to. By DakJen Creative LLC.';

/** Public contact shown on legal pages. CONFIRM WITH DAKOTAH before launch. */
export const CONTACT_EMAIL = 'dakjenenterprises@gmail.com';
