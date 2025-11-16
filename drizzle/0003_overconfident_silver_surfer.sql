ALTER TABLE "demographics" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "locations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "demographics" CASCADE;--> statement-breakpoint
DROP TABLE "locations" CASCADE;--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_owner_gender_id_demographics_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_owner_race_id_demographics_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_owner_religion_id_demographics_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" DROP CONSTRAINT "businesses_owner_region_id_locations_id_fk";
--> statement-breakpoint
DROP TYPE "public"."demographic_category";--> statement-breakpoint
DROP TYPE "public"."location_category";