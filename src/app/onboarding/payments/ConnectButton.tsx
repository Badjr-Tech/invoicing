"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { startStripeConnect } from "./actions";

export default function ConnectButton({
  businessId,
  connected,
}: {
  businessId: number;
  connected: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (connected) {
    return (
      <span className="flex items-center gap-1.5 rounded-control bg-sage-100 px-4 py-2 text-sm font-semibold text-sage-700">
        <Check size={16} strokeWidth={3} /> Connected
      </span>
    );
  }

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await startStripeConnect(businessId);
      if (result.ok) {
        window.location.href = result.url;
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500 disabled:opacity-60"
      >
        {isPending ? "Opening Stripe…" : "Connect with Stripe"}
      </button>
      {error && (
        <p className="mt-2 max-w-xs text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
