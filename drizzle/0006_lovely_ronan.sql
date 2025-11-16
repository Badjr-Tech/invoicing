CREATE TABLE "dbas" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"dba_name" text NOT NULL,
	"legal_business_name" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "tax_full_name" text;--> statement-breakpoint
ALTER TABLE "service_categories" ADD COLUMN "dba_id" integer;--> statement-breakpoint
ALTER TABLE "dbas" ADD CONSTRAINT "dbas_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_dba_id_dbas_id_fk" FOREIGN KEY ("dba_id") REFERENCES "public"."dbas"("id") ON DELETE no action ON UPDATE no action;