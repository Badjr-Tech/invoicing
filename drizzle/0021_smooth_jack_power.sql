CREATE TABLE "business_compliance_checklist" (
	"id" serial PRIMARY KEY NOT NULL,
	"business_id" integer NOT NULL,
	"item_id" text NOT NULL,
	"is_checked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contractors" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "business_compliance_checklist" ADD CONSTRAINT "business_compliance_checklist_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;