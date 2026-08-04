import Link from "next/link";

/**
 * Persistent reminder shown until onboarding is finished.
 *
 * Tone matters here: during the trial this is an invitation, not a threat.
 * It only sharpens on the final day.
 */
export default function TrialBanner({
  daysRemaining,
  progress,
}: {
  daysRemaining: number;
  progress: number;
}) {
  const urgent = daysRemaining <= 1;
  const percent = Math.round(progress * 100);

  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-6 py-3 lg:px-8 ${
        urgent
          ? "border-ember-200 bg-ember-50"
          : "border-clay-200 bg-white"
      }`}
    >
      <div className="flex-1 min-w-[16rem]">
        <p className="text-sm font-semibold text-clay-800">
          {daysRemaining > 0
            ? `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left in your trial`
            : "Finish setting up to keep your tools"}
        </p>
        <p className="text-xs text-clay-600 mt-0.5">
          {percent}% set up — connect payments to start invoicing.
        </p>
      </div>

      <div className="hidden sm:block w-40">
        <div className="h-1.5 w-full rounded-full bg-clay-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-sage-400 transition-all"
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>
      </div>

      <Link
        href="/onboarding"
        className="rounded-control bg-ember-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-ember-500"
      >
        Finish setup
      </Link>
    </div>
  );
}
