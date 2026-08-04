"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { markMeetingBooked } from "./actions";

export default function BookedConfirm({ alreadyBooked }: { alreadyBooked: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (alreadyBooked) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-sage-700">
        <Check size={16} strokeWidth={3} /> Meeting booked — see you then.
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await markMeetingBooked();
          router.push("/onboarding");
        })
      }
      className="rounded-control bg-transparent px-0 py-1 text-sm font-semibold text-sage-600 underline underline-offset-4 transition hover:bg-transparent hover:text-sage-700 disabled:opacity-60"
    >
      {isPending ? "Saving…" : "I've booked my meeting"}
    </button>
  );
}
