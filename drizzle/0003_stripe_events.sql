-- Stripe webhook event log (spec §3.5). Persist-before-process; the primary
-- key is Stripe's own event id, so redelivery is idempotent by construction.
-- Additive only; safe to re-run.

CREATE TABLE IF NOT EXISTS "stripe_events" (
  "id" text PRIMARY KEY,
  "type" text NOT NULL,
  "payload" text NOT NULL,
  "received_at" timestamp with time zone DEFAULT now() NOT NULL,
  "processed_at" timestamp with time zone,
  "error" text
);
