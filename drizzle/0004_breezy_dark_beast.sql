ALTER TABLE "invoices" ADD COLUMN "services_json" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_number" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "service_description";