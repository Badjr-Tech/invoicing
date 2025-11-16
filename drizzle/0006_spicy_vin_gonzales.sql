ALTER TABLE "dbas" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "dbas" CASCADE;--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_dba_id_dbas_id_fk";
--> statement-breakpoint
ALTER TABLE "service_categories" DROP CONSTRAINT "service_categories_dba_id_dbas_id_fk";
--> statement-breakpoint
ALTER TABLE "businesses" DROP COLUMN "tax_full_name";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "dba_id";--> statement-breakpoint
ALTER TABLE "service_categories" DROP COLUMN "dba_id";