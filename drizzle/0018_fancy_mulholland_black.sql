CREATE TABLE "contractors" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"business_id" integer NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"monthly_payment" numeric(10, 2) NOT NULL,
	"tax_id" varchar(20),
	"address" text,
	"city" text,
	"state" varchar(2),
	"zip_code" varchar(10),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;