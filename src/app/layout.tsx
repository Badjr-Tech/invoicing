import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

/**
 * Type pairing.
 *
 * Fraunces for display: a soft, organic serif with real warmth in its
 * curves — it reads handmade rather than corporate, which suits a platform
 * for owner-operated businesses. Variable, so weight and optical size are
 * fluid.
 *
 * DM Sans for body: geometric and quiet, so it carries dense financial
 * tables without competing with the headings.
 *
 * NOTE: the CSS variable name must stay in step with tailwind.config.ts.
 * These were previously mismatched (--font-bebas-neue vs --font-display),
 * so every heading silently fell back to Georgia.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AGENCY",
  description:
    "Register your business, run your books, invoice your clients, and get paid — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
