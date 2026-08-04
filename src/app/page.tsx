import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  AtSign,
  BookOpen,
  Building2,
  CalendarCheck,
  FileText,
  Handshake,
  LineChart,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";

/**
 * Public landing page.
 *
 * Leads with what the platform does, because that is the product. The
 * percentage is framed as what it replaces — no monthly fee, no contract, and
 * no processing fee on bank transfers, which is literally true: AGENCY is the
 * Stripe fee payer (controller.fees.payer = 'application'), so it absorbs the
 * processing cost out of its own percentage.
 *
 * Do not overstate this. Card payments carry a 1.5% member contribution, so
 * the copy says bank transfer specifically.
 */

const TOOLKIT = [
  {
    icon: Receipt,
    title: "Invoicing & payments",
    body: "Build an invoice, send it, get paid by bank transfer or card. Clients, services and rates all live here.",
  },
  {
    icon: Wallet,
    title: "Bookkeeping",
    body: "Income, expenses, categories and recurring entries — posting themselves as money moves, with reports you can hand your accountant.",
  },
  {
    icon: LineChart,
    title: "Budgeting & pricing",
    body: "Operating budgets, product and service pricing calculators, and owner pay — so your rates come from your numbers, not a guess.",
  },
  {
    icon: Building2,
    title: "Business setup",
    body: "Register your business and DBAs, keep your formation details, EIN and branding in one place, and work a compliance checklist.",
  },
  {
    icon: FileText,
    title: "Contracts & scopes",
    body: "Send contracts to clients from the platform, branded as your business, with the file attached.",
  },
  {
    icon: Users,
    title: "Contractors",
    body: "Track who you pay, onboard them properly, and keep the paperwork where you can find it in January.",
  },
  {
    icon: AtSign,
    title: "Business email",
    body: "Send from your own business name, with replies going straight to your inbox. Included — pick your address and you are sending.",
  },
];

const INCLUDED = [
  {
    icon: CalendarCheck,
    title: "Consulting & meetings",
    body: "Real conversations about your actual business — pricing, scope, hiring, a bad month. Not a chatbot and not a help centre.",
  },
  {
    icon: BookOpen,
    title: "Classes & resources",
    body: "The AGENCY course, templates, contracts and the frameworks we use with our own clients.",
  },
  {
    icon: Handshake,
    title: "Business connections",
    body: "Introductions, opportunities and referrals from inside the network.",
  },
];

/**
 * Sold separately, per spec §6.6. Named here so the page never implies the
 * percentage covers a website build or a per-seat mailbox.
 */
const ADD_ONS = ["Website build & hosting", "Portfolio", "Campaigns"];

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

      {/* Hero — what it is */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage-700">
          Everything your small business runs on
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.08] text-clay-800 md:text-6xl">
          One place for the
          <br />
          whole business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-clay-700">
          Invoicing, payments, bookkeeping, budgeting, pricing, contracts,
          contractors, business registration, classes and resources — plus real
          people to talk to. AGENCY is the back office you would build if you
          had the time.
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

      {/* The toolkit */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="font-display text-3xl text-clay-800 md:text-4xl">
          The tools, all in one login
        </h2>
        <p className="mt-3 max-w-2xl text-clay-600">
          No stitching together five subscriptions that do not talk to each
          other.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TOOLKIT.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-card border border-clay-200 bg-white p-6 shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-control bg-sage-100 text-sage-700">
                <Icon size={19} />
              </span>
              <h3 className="mt-4 font-display text-lg text-clay-800">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-clay-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Not just software */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-card border border-clay-200 bg-white p-8 shadow-card md:p-12">
          <h2 className="font-display text-3xl text-clay-800 md:text-4xl">
            And it is not just software
          </h2>
          <p className="mt-3 max-w-2xl text-clay-600">
            Membership comes with the things software cannot give you.
          </p>

          <div className="mt-9 grid gap-8 md:grid-cols-3">
            {INCLUDED.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-control bg-ember-100 text-ember-700">
                  <Icon size={19} />
                </span>
                <h3 className="mt-4 font-display text-lg text-clay-800">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-clay-600">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-clay-200 pt-7">
            <p className="text-sm text-clay-600">
              <span className="font-semibold text-clay-800">
                Need more than the platform?
              </span>{" "}
              {ADD_ONS.join(" · ")} — done by our studio, quoted separately when
              you want them. Never bundled into your rate, never switched on
              without you asking.
            </p>
          </div>
        </div>
      </section>

      {/* How it is paid for */}
      <section className="border-y border-clay-200 bg-sage-800">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl text-white md:text-4xl">
            One percentage. Nothing on top.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sage-100">
            No monthly fee. No annual contract. No card on file. We get paid the
            same way you do — when your client pays — and that single percentage
            is the only number you will ever see from us.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-card border border-sage-700 bg-sage-900/40 p-6">
              <p className="font-display text-xl text-ember-300">
                Processing, on us
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-sage-100">
                Stripe still takes its cut of every payment — it just comes out
                of our percentage instead of yours. You will never see a
                separate processing line.
              </p>
            </div>
            <div className="rounded-card border border-sage-700 bg-sage-900/40 p-6">
              <p className="font-display text-xl text-ember-300">
                Every tool, unlocked
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-sage-100">
                Invoicing, bookkeeping, budgeting, pricing, contracts and
                contractors — from day one. Unlimited invoices, unlimited
                clients, no seats, no tiers, nothing held back behind an
                upgrade.
              </p>
            </div>
            <div className="rounded-card border border-sage-700 bg-sage-900/40 p-6">
              <p className="font-display text-xl text-ember-300">
                And us, included
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-sage-100">
                Consulting, meetings, classes, templates and introductions come
                with membership. There is no hourly rate behind them.
              </p>
            </div>
          </div>

          <p className="mt-10 max-w-2xl text-lg text-sage-100">
            Slow month? You pay almost nothing. Best month you have ever had?
            Our percentage goes <em className="not-italic text-ember-300">down</em>.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-sage-300">
            Bank transfer is the default — cheapest for your client and best for
            you. Cards cost noticeably more to run, so they stay off until you
            decide you want them.
          </p>
        </div>
      </section>

      {/* Close */}
      <section className="mx-auto max-w-6xl px-6 py-20">
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
