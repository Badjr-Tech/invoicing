import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * Public landing page.
 *
 * States the model plainly, including the rate. A member who understands the
 * percentage before signing up is a member who does not feel ambushed by the
 * first invoice — and the pricing is a selling point, not a disclosure.
 */

const PILLARS = [
  {
    title: "Get paid",
    body: "Invoice your clients and collect by bank transfer or card. The money lands in your account, not ours — we never hold your funds.",
  },
  {
    title: "Know your numbers",
    body: "Three numbers on every login: what you are owed, what you actually spend, and what is genuinely free to reinvest.",
  },
  {
    title: "Books that keep themselves",
    body: "Every payment posts itself, categorised, at gross — so what you hand your accountant in January already ties out.",
  },
  {
    title: "Learn as you build",
    body: "Classes, templates and the frameworks we use with our own clients. Pricing, scope, contracts, the lot.",
  },
];

const BANDS = [
  { range: "Up to $100k", rate: "7%" },
  { range: "$100k – $500k", rate: "5%" },
  { range: "Above $500k", rate: "3%" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-clay-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <Image src="/agency-logo.svg" alt="" width={36} height={36} priority />
          <span className="font-display text-lg tracking-wide text-clay-800">
            AGENCY
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/login" className="font-medium text-clay-700 hover:text-clay-900">
            Sign in
          </Link>
          <Link
            href="/create-account"
            className="rounded-control bg-ember-600 px-4 py-2 font-semibold text-white transition hover:bg-ember-500"
          >
            Start free
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-14 md:pt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage-700">
          A business incubator, built into software
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.08] text-clay-800 md:text-6xl">
          Run the business.
          <br />
          Not the paperwork.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-clay-700">
          AGENCY is where owner-operated businesses register, invoice, get paid,
          keep their books and learn to grow — in one place, with a real person
          behind it.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/create-account"
            className="inline-flex items-center gap-2 rounded-control bg-ember-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-ember-500"
          >
            Start your 7 days <ArrowRight size={17} />
          </Link>
          <span className="text-sm text-clay-600">
            Full access. No card required.
          </span>
        </div>
      </section>

      {/* The model — stated plainly */}
      <section className="border-y border-clay-200 bg-sage-800">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl text-white md:text-4xl">
            We earn when you earn. Not before.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-sage-100">
            No monthly seat fee. No annual contract. AGENCY takes a percentage
            of what you actually collect through the platform — so a quiet month
            costs you almost nothing, and we only do well when you do.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {BANDS.map((band) => (
              <div
                key={band.range}
                className="rounded-card border border-sage-700 bg-sage-900/40 p-6"
              >
                <p className="font-display text-4xl text-ember-300">{band.rate}</p>
                <p className="mt-2 text-sm text-sage-100">{band.range}</p>
                <p className="mt-1 text-xs text-sage-300">
                  of what you collect, per year
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-sage-300">
            Bank transfer is the default. Card payments cost more to process and
            are off unless you turn them on.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-3xl text-clay-800 md:text-4xl">
          Everything the business actually needs
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-card border border-clay-200 bg-white p-7 shadow-card"
            >
              <h3 className="font-display text-xl text-clay-800">
                {pillar.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-clay-600">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Close */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-card border border-ember-200 bg-ember-50 px-8 py-12 text-center">
          <h2 className="font-display text-3xl text-clay-800">
            Seven days, everything unlocked.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-clay-700">
            Look around properly before you connect anything. If it is not for
            you, walk away — we will not have taken a cent.
          </p>
          <Link
            href="/create-account"
            className="mt-7 inline-flex items-center gap-2 rounded-control bg-ember-600 px-6 py-3 font-semibold text-white transition hover:bg-ember-500"
          >
            Create your account <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-clay-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-clay-600">
          <span>AGENCY — DakJen Creative LLC</span>
          <Link href="/login" className="font-medium hover:text-clay-800">
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
