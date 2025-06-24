ALTER TABLE "course_purchase" DROP CONSTRAINT "course_purchase_unlock_token_unique";--> statement-breakpoint
ALTER TABLE "course_purchase" ADD COLUMN "access_code" text;--> statement-breakpoint
ALTER TABLE "course_purchase" ADD CONSTRAINT "course_purchase_access_code_unique" UNIQUE("access_code");