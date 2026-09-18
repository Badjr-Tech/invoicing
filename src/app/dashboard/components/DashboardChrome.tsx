"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

/**
 * Responsive frame for the dashboard.
 *
 * Desktop: the sidebar is a fixed column, as before. Below lg the old layout
 * simply clamped a 256px aside onto a 375px screen; now the sidebar becomes a
 * drawer behind a top bar, closing on navigation and on Escape.
 *
 * The sidebar and page content arrive as props from the server layout, so
 * nothing here refetches anything.
 */
export default function DashboardChrome({
  sidebar,
  banner,
  children,
}: {
  sidebar: React.ReactNode;
  banner: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Navigating means the member picked something — the drawer's job is done.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex min-h-screen bg-clay-50">
      {/* Desktop sidebar */}
      <aside className="relative hidden w-64 shrink-0 space-y-2 bg-sage-800 px-4 pt-4 text-sage-50 lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer + scrim */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-clay-900/50"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] space-y-2 overflow-y-auto bg-sage-800 px-4 pb-8 pt-4 text-sage-50 shadow-lift">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-control p-1.5 text-sage-200 hover:bg-sage-700 hover:text-white"
            >
              <X size={18} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-clay-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2.5">
            <Image src="/agency-logo.svg" alt="" width={28} height={28} />
            <span className="font-display text-base tracking-wide text-clay-800">
              AGENCY
            </span>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-control border border-clay-200 p-2 text-clay-700 hover:bg-clay-50"
          >
            <Menu size={19} />
          </button>
        </header>

        <main className="flex flex-1 flex-col overflow-x-hidden text-clay-800">
          {banner}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
          <footer className="mt-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1 py-6 text-xs text-clay-500">
            <span>AGENCY — DakJen Creative LLC</span>
            <a href="/privacy" className="hover:text-clay-700">Privacy</a>
            <a href="/terms" className="hover:text-clay-700">Terms</a>
          </footer>
        </main>
      </div>
    </div>
  );
}
