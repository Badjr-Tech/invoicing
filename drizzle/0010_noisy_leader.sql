CREATE TYPE "public"."service_designation" AS ENUM('hourly', 'per deliverable', 'flat fee');--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "designation" "service_designation" DEFAULT 'flat fee' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "service_number" text;