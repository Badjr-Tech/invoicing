"use client";

import { useFormStatus } from "react-dom";

/**
 * Submit button that shows progress while its form's server action runs.
 *
 * Must live inside the <form> it reports on — useFormStatus reads the
 * nearest form ancestor. Disabled while pending, so double-submits (double
 * invoices, double accounts) cannot happen from impatient clicking.
 */
export default function PendingButton({
  children,
  className,
  disabled = false,
  pendingLabel = "Working…",
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span
            aria-hidden
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
