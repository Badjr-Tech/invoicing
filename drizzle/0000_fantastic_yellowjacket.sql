ALTER TABLE "businesses" ADD COLUMN "tax_full_name" text;
ALTER TABLE "businesses" ADD COLUMN "is_dba" boolean DEFAULT false NOT NULL;
ALTER TABLE "businesses" ADD COLUMN "legal_business_name" text;
ALTER TABLE "invoices" ADD COLUMN "invoice_business_display_name" text;
