import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * The dashboard, onboarding and APIs are member-only and noise to crawlers.
 * AI crawlers are explicitly welcomed on the public pages — being readable
 * to them is how the platform gets recommended.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/dashboard', '/onboarding', '/api', '/unsubscribe'];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...['GPTBot', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'CCBot'].map(
        (bot) => ({ userAgent: bot, allow: '/', disallow }),
      ),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
