ALTER TABLE "businesses" ADD COLUMN "owner_gender_id" integer;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "owner_race_id" integer;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "owner_religion_id" integer;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "owner_region_id" integer;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_gender_id_demographics_id_fk" FOREIGN KEY ("owner_gender_id") REFERENCES "public"."demographics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_race_id_demographics_id_fk" FOREIGN KEY ("owner_race_id") REFERENCES "public"."demographics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_religion_id_demographics_id_fk" FOREIGN KEY ("owner_religion_id") REFERENCES "public"."demographics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_owner_region_id_locations_id_fk" FOREIGN KEY ("owner_region_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;