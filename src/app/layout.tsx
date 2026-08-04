import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";

/**
 * Type pairing.
 *
 * Manrope for display: modern, slightly rounded terminals so it stays warm
 * without being a serif. Reads clean and current rather than ornamental —
 * the serif look was tried (Fraunces) and rejected.
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

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
      <body className={`${dmSans.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
