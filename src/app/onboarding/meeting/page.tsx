import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { db } from "@/db";
import { platformSettings } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { loadAccessState } from "@/lib/onboarding-access";
import BookedConfirm from "./BookedConfirm";

export default async function MeetingStepPage() {
  const user = await requireUser();
  const access = await loadAccessState(user.id);
  const alreadyBooked =
    access?.steps.find((step) => step.id === "meeting")?.complete ?? false;

  const settings = await db.select().from(platformSettings).limit(1);
  const schedulingUrl = settings[0]?.onboardingMeetingUrl ?? null;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/onboarding"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-clay-600 hover:text-clay-800"
      >
        <ArrowLeft size={16} /> Setup
      </Link>

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-sage-600">
        Step 4
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-clay-800">
        Book your onboarding meeting.
      </h1>
      <p className="mt-3 text-clay-700">
        This is a working session, not a sales call. We go through where your
        revenue actually comes from, what your fixed and variable expenses are,
        what you are paying yourself, and what you are missing. What comes out
        of it sets up the rest of your platform.
      </p>

      <div className="mt-6 rounded-card border border-sage-200 bg-sage-50 p-5">
        <p className="text-sm font-semibold text-clay-800">Come with, if you have them:</p>
        <ul className="mt-2 space-y-1.5 text-sm text-clay-700">
          <li>• Roughly what you brought in over the last six months</li>
          <li>• Your recurring monthly costs</li>
          <li>• What you currently pay yourself</li>
          <li>• The one thing about your business that keeps you up</li>
        </ul>
        <p className="mt-3 text-sm text-clay-600">
          Estimates are fine. Nobody arrives with perfect numbers.
        </p>
      </div>

      <div className="mt-8 rounded-card border border-clay-200 bg-white p-6">
        {schedulingUrl ? (
          <>
            <a
              href={schedulingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500"
            >
              <CalendarDays size={16} /> Pick a time
            </a>
            <p className="mt-3 text-sm text-clay-600">
              Opens the scheduler in a new tab. Come back here once you have a
              time confirmed.
            </p>
          </>
        ) : (
          <p className="text-sm text-clay-600">
            The scheduling link has not been set up yet. An admin can add it in
            platform settings.
          </p>
        )}

        <div className="mt-5 border-t border-clay-200 pt-5">
          <BookedConfirm alreadyBooked={alreadyBooked} />
        </div>
      </div>
    </div>
  );
}
