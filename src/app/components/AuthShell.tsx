import Image from "next/image";
import Link from "next/link";

/**
 * Shared frame for the signed-out screens.
 *
 * Split layout: a sage panel carrying the promise, and the form on warm
 * neutral. The panel is what makes this read as a considered product rather
 * than a default form on a white page — but it is decoration, so it is
 * hidden below lg where the form is all that matters.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-clay-50">
      {/* Brand panel */}
      <aside className="relative hidden w-[44%] max-w-xl flex-col justify-between overflow-hidden bg-sage-800 px-12 py-14 lg:flex">
        {/* Soft light bloom, so the panel is not a flat block of colour. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-sage-700 opacity-60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-20 h-[26rem] w-[26rem] rounded-full bg-ember-800 opacity-40 blur-3xl"
        />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <Image
            src="/agency-logo-light.svg"
            alt=""
            width={40}
            height={40}
            priority
          />
          <span className="font-display text-xl tracking-wide text-white">
            AGENCY
          </span>
        </Link>

        <div className="relative z-10">
          <p className="font-display text-4xl leading-[1.15] text-white">
            Run the business.
            <br />
            Not the paperwork.
          </p>
          <p className="mt-5 max-w-sm leading-relaxed text-sage-100">
            Your books, your invoices, your clients and your classes in one
            place — built for owner-operated businesses, not enterprises.
          </p>

          <ul className="mt-10 space-y-3.5">
            {[
              "Get paid directly, with the fee taken at the source",
              "Books that keep themselves as the money moves",
              "We earn a percentage — so we only win when you do",
            ].map((point) => (
              <li key={point} className="flex gap-3 text-sm text-sage-100">
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-300"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-sage-300">
          AGENCY — DakJen Creative LLC
        </p>
      </aside>

      {/* Form column */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Image
              src="/agency-logo.svg"
              alt="AGENCY"
              width={56}
              height={56}
              priority
            />
          </div>

          <h1 className="font-display text-3xl leading-tight text-clay-800">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-clay-600">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8 text-sm text-clay-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

/** Shared field styling, so every auth input matches. */
export const authInput =
  "block w-full rounded-control border border-clay-200 bg-white px-3.5 py-2.5 text-clay-800 shadow-sm transition placeholder:text-clay-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200/70";

export const authButton =
  "w-full rounded-control bg-ember-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-300 focus:ring-offset-2 focus:ring-offset-clay-50";
