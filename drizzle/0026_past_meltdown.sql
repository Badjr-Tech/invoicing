CREATE TABLE "user_checklist_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_id" integer NOT NULL,
	"item_id" text NOT NULL,
	"is_checked" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_compliance_checklist" RENAME TO "admin_checklist_items";--> statement-breakpoint
ALTER TABLE "admin_checklist_items" DROP CONSTRAINT "business_compliance_checklist_business_id_businesses_id_fk";
--> statement-breakpoint
ALTER TABLE "admin_checklist_items" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_checklist_items" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_checklist_items" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "admin_checklist_items" ADD COLUMN "link" text;--> statement-breakpoint
ALTER TABLE "user_checklist_progress" ADD CONSTRAINT "user_checklist_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_checklist_progress" ADD CONSTRAINT "user_checklist_progress_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_checklist_progress" ADD CONSTRAINT "user_checklist_progress_item_id_admin_checklist_items_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."admin_checklist_items"("item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_checklist_items" DROP COLUMN "business_id";--> statement-breakpoint
ALTER TABLE "admin_checklist_items" DROP COLUMN "is_checked";