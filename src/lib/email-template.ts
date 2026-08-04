/**
 * Branded HTML email rendering.
 *
 * Every member business carries its own palette (color1–color4 on the
 * businesses table), and mail sent to that member's clients is rendered in
 * it — so an invoice from Rivera Design looks like Rivera Design, not AGENCY.
 *
 * Email clients are not browsers. Outlook renders with Word's engine, Gmail
 * strips <style> blocks and anything it does not recognise. So this uses the
 * rules that actually survive: table layout, inline styles, no flex, no grid,
 * no external assets, hex colors only.
 */

export interface EmailBrand {
  /** Business name, shown in the header and footer. */
  name: string;
  /** Primary color: header band and buttons. Falls back to AGENCY sage. */
  color1?: string | null;
  /** Accent color: rules and highlights. */
  color2?: string | null;
  /** Logo URL. Must be publicly reachable — mail clients cannot see your app. */
  logoUrl?: string | null;
}

export interface EmailButton {
  label: string;
  url: string;
}

export interface BrandedEmailOptions {
  brand: EmailBrand;
  /** Large heading at the top of the message body. */
  heading: string;
  /** Body paragraphs, in order. Plain text — this escapes them. */
  paragraphs: string[];
  button?: EmailButton;
  /**
   * Optional key/value block, e.g. invoice number, amount, due date.
   * Rendered as a bordered summary panel.
   */
  details?: Array<{ label: string; value: string }>;
  /** Grey text under the divider. Contact info, address, unsubscribe. */
  footerNote?: string;
  /**
   * Preview text shown in the inbox list next to the subject. Without it,
   * clients scrape the first words of the body, which reads like an accident.
   */
  preheader?: string;
}

const DEFAULT_PRIMARY = '#6d8f5e'; // sage-600
const DEFAULT_ACCENT = '#c2703d'; // ember-600
const INK = '#3d3733';
const MUTED = '#7d7166';
const HAIRLINE = '#e8e2db';
const CANVAS = '#f7f4f0';

/** Escape text before it goes anywhere near the markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Only allow colors we can vouch for.
 *
 * A member's palette is user input that lands inside a style attribute, so
 * anything that is not a plain hex value is dropped rather than sanitised.
 */
function safeColor(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  return /^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed : fallback;
}

/**
 * Pick black or white text for a background, by luminance.
 *
 * A pale brand color with white text on it is unreadable, and members do
 * choose pale colors.
 */
function readableTextOn(hexColor: string): string {
  let hex = hexColor.slice(1);
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Rec. 709 luma, the usual approximation for perceived brightness.
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luma > 0.6 ? '#1f1b18' : '#ffffff';
}

export function renderBrandedEmail(options: BrandedEmailOptions): string {
  const { brand, heading, paragraphs, button, details, footerNote, preheader } =
    options;

  const primary = safeColor(brand.color1, DEFAULT_PRIMARY);
  const accent = safeColor(brand.color2, DEFAULT_ACCENT);
  const onPrimary = readableTextOn(primary);
  const businessName = escapeHtml(brand.name);

  const header = brand.logoUrl
    ? `<img src="${escapeHtml(brand.logoUrl)}" alt="${businessName}" width="140" style="display:block;border:0;max-width:140px;height:auto;">`
    : `<span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:bold;color:${onPrimary};">${businessName}</span>`;

  const body = paragraphs
    .map(
      (text) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK};">${escapeHtml(text)}</p>`,
    )
    .join('');

  const detailRows = details?.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;border:1px solid ${HAIRLINE};border-radius:8px;background:${CANVAS};">
         <tr><td style="padding:8px 20px;">
           <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
             ${details
               .map(
                 (row) => `<tr>
                   <td style="padding:8px 0;font-size:14px;color:${MUTED};">${escapeHtml(row.label)}</td>
                   <td align="right" style="padding:8px 0;font-size:14px;font-weight:bold;color:${INK};">${escapeHtml(row.value)}</td>
                 </tr>`,
               )
               .join('')}
           </table>
         </td></tr>
       </table>`
    : '';

  // Buttons are a padded table cell, not an <a> with padding — Outlook
  // ignores padding on inline elements.
  const cta = button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
         <tr><td align="center" bgcolor="${primary}" style="border-radius:8px;">
           <a href="${escapeHtml(button.url)}" style="display:inline-block;padding:13px 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:${onPrimary};text-decoration:none;border-radius:8px;">${escapeHtml(button.label)}</a>
         </td></tr>
       </table>`
    : '';

  const footer = footerNote
    ? `<p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED};">${escapeHtml(footerNote)}</p>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};-webkit-font-smoothing:antialiased;">
${
  preheader
    ? `<div style="display:none;font-size:1px;color:${CANVAS};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}</div>`
    : ''
}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${CANVAS};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${HAIRLINE};">

        <tr>
          <td align="center" bgcolor="${primary}" style="padding:28px 32px;">
            ${header}
          </td>
        </tr>

        <tr><td style="height:4px;background:${accent};line-height:4px;font-size:0;">&nbsp;</td></tr>

        <tr>
          <td style="padding:36px 32px 8px;font-family:Helvetica,Arial,sans-serif;">
            <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;font-weight:normal;color:${INK};">${escapeHtml(heading)}</h1>
            ${body}
            ${detailRows}
            ${cta}
          </td>
        </tr>

        <tr>
          <td style="padding:0 32px 32px;font-family:Helvetica,Arial,sans-serif;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td style="border-top:1px solid ${HAIRLINE};padding-top:20px;">
                ${footer}
                <p style="margin:12px 0 0;font-size:12px;color:${MUTED};">Sent by ${businessName} via AGENCY.</p>
              </td></tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/**
 * Plain-text twin of the HTML.
 *
 * Always send both: some clients prefer text, and a message with no text part
 * scores worse with spam filters.
 */
export function renderPlainText(options: BrandedEmailOptions): string {
  const lines = [options.heading, '', ...options.paragraphs];

  if (options.details?.length) {
    lines.push('');
    options.details.forEach((row) => lines.push(`${row.label}: ${row.value}`));
  }

  if (options.button) {
    lines.push('', `${options.button.label}: ${options.button.url}`);
  }

  if (options.footerNote) {
    lines.push('', options.footerNote);
  }

  lines.push('', `Sent by ${options.brand.name} via AGENCY.`);
  return lines.join('\n');
}
