import Link from "next/link";
import Image from "next/image";

/** Shared frame for the public legal pages, matching the marketing site. */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-clay-50">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/agency-logo.svg" alt="" width={32} height={32} />
          <span className="font-display text-lg tracking-wide text-clay-800">AGENCY</span>
        </Link>
        <Link href="/login" className="text-sm font-medium text-clay-700 hover:text-clay-900">
          Sign in
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-6">{children}</main>
      <footer className="border-t border-clay-200">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-6 py-8 text-sm text-clay-600">
          <span>AGENCY — DakJen Creative LLC</span>
          <Link href="/privacy" className="hover:text-clay-800">Privacy</Link>
          <Link href="/terms" className="hover:text-clay-800">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
