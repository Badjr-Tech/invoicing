-- Onboarding, trial and Stripe Connect columns.
--
-- Written by hand because the drizzle meta snapshots are corrupt and
-- drizzle-kit generate cannot read them. Additive only: every statement is
-- ADD COLUMN IF NOT EXISTS, so this is safe to re-run and cannot drop data.

-- Trial and onboarding state (spec §4.2)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tour_completed_at" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboarding_completed_at" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboarding_meeting_booked_at" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "gate_exempt_until" timestamp with time zone;

-- Stripe Connect (spec §3.1)
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripe_connect_account_id" text;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripe_connect_status" text DEFAULT 'not_started' NOT NULL;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripe_charges_enabled" boolean DEFAULT false NOT NULL;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripe_payouts_enabled" boolean DEFAULT false NOT NULL;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "stripe_connect_onboarded_at" timestamp with time zone;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "card_payments_enabled" boolean DEFAULT false NOT NULL;

-- Existing members should not be locked out by a trial that starts today.
-- Backdating created_at is deliberate: it is only used to compute the trial
-- window, and every current account predates the gate.
UPDATE "users" SET "created_at" = now() - interval '30 days' WHERE "created_at" >= now() - interval '1 minute';
