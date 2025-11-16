ALTER TABLE "dbas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "dbas" CASCADE;--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_dba_id_dbas_id_fk";
--> statement-breakpoint
ALTER TABLE "service_categories" DROP CONSTRAINT "service_categories_dba_id_dbas_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "is_dba" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "legal_business_name" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_business_display_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "dba_id";--> statement-breakpoint
ALTER TABLE "service_categories" DROP COLUMN "dba_id";