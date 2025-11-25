ALTER TYPE "public"."class_type" ADD VALUE 'hth-course';--> statement-breakpoint
CREATE TABLE "pitch_competition_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pitch_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"pitch_url" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pitch_submissions" ADD CONSTRAINT "pitch_submissions_event_id_pitch_competition_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."pitch_competition_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pitch_submissions" ADD CONSTRAINT "pitch_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;