"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  FileText,
  HandCoins,
  Users,
  Wallet,
} from "lucide-react";
import { completeTour } from "./actions";

interface Slide {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
}

/**
 * The walkthrough content.
 *
 * Order is deliberate: what this is, why it is priced the way it is, how the
 * money actually moves, then the tools. The pricing conversation comes early
 * and plainly — a member who understands the model before they see the
 * features never feels ambushed by the first fee on an invoice.
 */
const SLIDES: Slide[] = [
  {
    eyebrow: "What this is",
    title: "A business incubator, built into software.",
    body: (
      <>
        <p>
          AGENCY is where you register your business, learn how to run it, keep
          your books, invoice your clients, and get paid — in one place,
          instead of five subscriptions that do not talk to each other.
        </p>
        <p>
          It is not a neutral container. The way we think a small business
          should be run is built into the tools themselves.
        </p>
      </>
    ),
  },
  {
    eyebrow: "Why we do it this way",
    title: "We earn when you earn. Not before.",
    body: (
      <>
        <p>
          There is no monthly subscription. AGENCY takes a percentage of the
          money that flows through the platform, and nothing when nothing
          flows.
        </p>
        <div className="mt-5 overflow-hidden rounded-card border border-clay-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-clay-100 text-xs uppercase tracking-wide text-clay-600">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Your yearly revenue</th>
                <th className="px-4 py-2.5 font-semibold">Our share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clay-200 bg-white">
              <tr>
                <td className="px-4 py-2.5">Up to $100,000</td>
                <td className="px-4 py-2.5 font-semibold text-ember-600">7%</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">$100,000 – $500,000</td>
                <td className="px-4 py-2.5 font-semibold text-ember-600">5%</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5">Above $500,000</td>
                <td className="px-4 py-2.5 font-semibold text-ember-600">3%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-clay-600">
          The rate drops as you grow. Conventional software charges you the same
          whether you made ten thousand dollars this month or nothing at all.
        </p>
      </>
    ),
  },
  {
    eyebrow: "How the money moves",
    title: "Your client pays you. We take our share at the source.",
    body: (
      <>
        <p>
          You send an invoice from AGENCY. Your client pays it by bank transfer.
          The money goes to your account, and our percentage is split off
          automatically as it passes through — so there is never a bill to pay
          later, and never a surprise.
        </p>
        <p>
          Bank transfer is the default because it costs the least. Card payments
          are available if your clients need them, but they cost more to
          process, so they add 1.5% — and they stay switched off until you turn
          them on yourself.
        </p>
        <p className="rounded-card border border-sage-200 bg-sage-50 p-4 text-sm text-clay-700">
          <strong className="text-clay-800">You keep the receipts.</strong> Every
          fee we take is recorded in your books as a deductible expense, and
          your income is recorded in full — so your numbers match what the IRS
          sees in January.
        </p>
      </>
    ),
  },
  {
    eyebrow: "Your dashboard",
    title: "Three numbers, every time you log in.",
    body: (
      <>
        <p>
          Most accounting software buries the answer in a report. Your home
          screen leads with the only three things that decide whether this month
          works:
        </p>
        <ul className="mt-4 space-y-3">
          {[
            ["What you need to get paid", "Money owed to you, and who is late."],
            ["What your expenses actually are", "Not what you assumed. What they are."],
            ["What is available for growth", "The part you can actually spend."],
          ].map(([title, detail]) => (
            <li key={title} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ember-500" />
              <span>
                <strong className="text-clay-800">{title}</strong>
                <span className="block text-sm text-clay-600">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    eyebrow: "What you get",
    title: "The tools, and who they are for.",
    body: (
      <>
        <div className="mt-1 grid gap-3 sm:grid-cols-2">
          {[
            [FileText, "Invoicing", "Bill clients, track what is unpaid, get paid faster."],
            [Wallet, "Bookkeeping", "Income and fees post themselves. You categorize."],
            [BarChart3, "Budget & pricing", "Know what to charge, and what you can spend."],
            [Users, "Clients & contractors", "Who you serve, and who works with you."],
            [BookOpen, "Classes & resources", "The playbooks, not just the paperwork."],
            [HandCoins, "Contracts", "Scopes of work that protect your time."],
          ].map(([Icon, title, detail]) => {
            const Component = Icon as typeof FileText;
            return (
              <div
                key={title as string}
                className="rounded-card border border-clay-200 bg-white p-4"
              >
                <Component size={18} className="text-sage-500" />
                <p className="mt-2.5 font-semibold text-clay-800">{title as string}</p>
                <p className="mt-0.5 text-sm text-clay-600">{detail as string}</p>
              </div>
            );
          })}
        </div>
      </>
    ),
  },
  {
    eyebrow: "What happens next",
    title: "Two things, and you are running.",
    body: (
      <>
        <p>
          <strong className="text-clay-800">Connect your payments.</strong> This
          is how you invoice and how you get paid. It takes a few minutes and
          Stripe handles the verification.
        </p>
        <p>
          <strong className="text-clay-800">Book your onboarding meeting.</strong>{" "}
          A working session where we map your business — where the revenue comes
          from, what your real expenses are, what you are missing. What comes out
          of it configures the rest of your platform.
        </p>
        <p className="text-sm text-clay-600">
          You have seven days of full access from today. Finish these before it
          ends and nothing gets interrupted.
        </p>
      </>
    ),
  },
];

export default function TourClient({ alreadyComplete }: { alreadyComplete: boolean }) {
  const [index, setIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  function goNext() {
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    startTransition(async () => {
      // Re-marking a finished tour is harmless, but there is no reason to
      // write on every replay.
      if (!alreadyComplete) {
        await completeTour();
      }
      router.push("/onboarding");
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress pips double as a sense of how much is left. */}
      <div className="flex gap-1.5" role="presentation">
        {SLIDES.map((s, i) => (
          <span
            key={s.title}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= index ? "bg-ember-500" : "bg-clay-200"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 min-h-[26rem]">
        <p className="text-xs font-semibold uppercase tracking-widest text-sage-600">
          {slide.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-clay-800">
          {slide.title}
        </h1>
        <div className="mt-5 space-y-4 text-clay-700 [&_p]:leading-relaxed">
          {slide.body}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-clay-200 pt-6">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          className="flex items-center gap-1.5 rounded-control bg-transparent px-3 py-2 text-sm font-medium text-clay-600 transition hover:bg-clay-100 hover:text-clay-800 disabled:invisible"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <span className="text-xs font-medium text-clay-500">
          {index + 1} of {SLIDES.length}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500 disabled:opacity-60"
        >
          {isLast ? (isPending ? "Finishing…" : "Finish") : "Next"}
          {!isLast && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
