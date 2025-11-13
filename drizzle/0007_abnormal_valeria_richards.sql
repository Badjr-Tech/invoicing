CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'sent', 'paid');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"client_name" text NOT NULL,
	"client_email" text NOT NULL,
	"service_description" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "type" SET DEFAULT 'agency-course'::text;--> statement-breakpoint
DROP TYPE "public"."class_type";--> statement-breakpoint
CREATE TYPE "public"."class_type" AS ENUM('pre-course', 'agency-course');--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "type" SET DEFAULT 'agency-course'::"public"."class_type";--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "type" SET DATA TYPE "public"."class_type" USING "type"::"public"."class_type";--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;