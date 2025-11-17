CREATE TABLE "dbas" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dbas" ADD CONSTRAINT "dbas_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" DROP COLUMN "is_dba";--> statement-breakpoint
ALTER TABLE "businesses" DROP COLUMN "legal_business_name";