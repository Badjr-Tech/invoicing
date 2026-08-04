import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import type { OnboardingStep } from "@/lib/onboarding";

/**
 * Shown across the dashboard once the trial has lapsed and onboarding is
 * unfinished.
 *
 * The member keeps full read access on purpose — they can open invoicing,
 * bookkeeping, every screen — so this banner explains why the buttons do
 * nothing rather than pretending the pages do not exist. Showing the product
 * is the argument for finishing setup.
 */
export default function LockedBanner({
  steps,
  progress,
}: {
  steps: OnboardingStep[];
  progress: number;
}) {
  const remaining = steps.filter((step) => !step.complete);
  const next = remaining[0];

  return (
    <div className="border-b border-ember-200 bg-ember-50">
      <div className="px-6 py-4 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember-100 text-ember-700">
              <Lock size={15} />
            </span>
            <div>
              <p className="font-semibold text-clay-800">
                Your trial has ended — look around all you like.
              </p>
              <p className="mt-0.5 max-w-2xl text-sm text-clay-700">
                Everything stays visible so you can see what you are getting.
                To start using it,{" "}
                {remaining.length === 1
                  ? "there is one step left."
                  : `there are ${remaining.length} steps left.`}
              </p>
            </div>
          </div>

          {next && (
            <Link
              href={next.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-control bg-ember-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ember-500"
            >
              {next.title} <ArrowRight size={15} />
            </Link>
          )}
        </div>

        <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5 pl-11">
          {steps.map((step) => (
            <li
              key={step.id}
              className={`flex items-center gap-1.5 text-xs ${
                step.complete ? "text-sage-700" : "text-clay-600"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  step.complete
                    ? "bg-sage-600 text-white"
                    : "border border-clay-300"
                }`}
              >
                {step.complete && <Check size={10} strokeWidth={3} />}
              </span>
              {step.title}
            </li>
          ))}
        </ul>

        <div
          className="mt-3 h-1 overflow-hidden rounded-full bg-ember-100"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-ember-500 transition-all"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
