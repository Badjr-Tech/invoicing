CREATE TABLE "platform_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_fee" numeric(5, 2)
);
--> statement-breakpoint
ALTER TABLE "businesses" DROP COLUMN "admin_fee";