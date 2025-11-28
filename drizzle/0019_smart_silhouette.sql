ALTER TABLE "contractors" ADD COLUMN "invitation_token" text;--> statement-breakpoint
ALTER TABLE "contractors" ADD COLUMN "invitation_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contractors" ADD COLUMN "onboarded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contractors" ADD COLUMN "w9_url" text;--> statement-breakpoint
ALTER TABLE "contractors" ADD COLUMN "contractor_tax_id" varchar(20);--> statement-breakpoint
ALTER TABLE "contractors" ADD COLUMN "contractor_address" text;--> statement-breakpoint
ALTER TABLE "contractors" ADD COLUMN "contractor_city" text;--> statement-breakpoint
ALTER TABLE "contractors" ADD COLUMN "contractor_state" varchar(2);--> statement-breakpoint
ALTER TABLE "contractors" ADD COLUMN "contractor_zip_code" varchar(10);--> statement-breakpoint
ALTER TABLE "contractors" DROP COLUMN "tax_id";--> statement-breakpoint
ALTER TABLE "contractors" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "contractors" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "contractors" DROP COLUMN "state";--> statement-breakpoint
ALTER TABLE "contractors" DROP COLUMN "zip_code";--> statement-breakpoint
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_invitation_token_unique" UNIQUE("invitation_token");