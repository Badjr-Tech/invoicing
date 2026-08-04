import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { requireUser } from "@/lib/session";
import { loadAccessState } from "@/lib/onboarding-access";

export default async function OnboardingHubPage() {
  const user = await requireUser();
  const access = await loadAccessState(user.id);

  if (!access) redirect("/login");
  if (access.onboardingComplete) redirect("/dashboard");

  const firstName = user.name?.split(" ")[0] ?? "there";
  const nextStep = access.steps.find((step) => !step.complete);
  const done = access.steps.filter((s) => s.complete).length;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-widest text-sage-600">
        Welcome to AGENCY
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-clay-800">
        Let&apos;s get you set up, {firstName}.
      </h1>
      <p className="mt-3 max-w-2xl text-clay-600">
        {access.trialActive ? (
          <>
            You have full access for the next{" "}
            <strong className="text-clay-800">
              {access.trialDaysRemaining}{" "}
              {access.trialDaysRemaining === 1 ? "day" : "days"}
            </strong>
            . Look around as much as you like — finish these four steps before
            the trial ends and nothing gets interrupted.
          </>
        ) : (
          <>
            Your trial has ended. Finish these steps to unlock your tools again
            — your work is exactly where you left it.
          </>
        )}
      </p>

      <div className="mt-8 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-clay-200">
          <div
            className="h-full rounded-full bg-sage-400 transition-all duration-500"
            style={{ width: `${Math.max(access.progress * 100, 3)}%` }}
          />
        </div>
        <span className="text-sm font-medium text-clay-600">
          {done} of {access.steps.length}
        </span>
      </div>

      <ol className="mt-8 space-y-3">
        {access.steps.map((step, index) => {
          const isNext = step.id === nextStep?.id;
          return (
            <li key={step.id}>
              <Link
                href={step.href}
                className={`flex items-start gap-4 rounded-card border p-5 transition ${
                  step.complete
                    ? "border-clay-200 bg-white/60"
                    : isNext
                      ? "border-ember-200 bg-white shadow-card hover:shadow-lift"
                      : "border-clay-200 bg-white hover:border-clay-300"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    step.complete
                      ? "bg-sage-400 text-white"
                      : isNext
                        ? "bg-ember-600 text-white"
                        : "bg-clay-100 text-clay-500"
                  }`}
                >
                  {step.complete ? <Check size={16} strokeWidth={3} /> : index + 1}
                </span>

                <span className="flex-1">
                  <span
                    className={`block font-semibold ${
                      step.complete ? "text-clay-500 line-through" : "text-clay-800"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-clay-600">
                    {step.description}
                  </span>
                </span>

                {isNext && (
                  <span className="self-center rounded-control bg-ember-600 px-4 py-2 text-xs font-semibold text-white">
                    Start
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      {access.trialActive && (
        <p className="mt-8 text-center text-sm text-clay-500">
          <Link href="/dashboard" className="font-medium text-sage-600 underline underline-offset-4">
            Skip for now and explore the platform
          </Link>
        </p>
      )}
    </div>
  );
}
