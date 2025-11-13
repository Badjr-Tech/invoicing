CREATE TYPE "public"."class_type" AS ENUM('pre-course', 'agency-course');--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "type" "class_type" DEFAULT 'agency-course' NOT NULL;