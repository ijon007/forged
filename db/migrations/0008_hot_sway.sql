ALTER TABLE "course_purchase" ADD COLUMN "unlock_token" text;--> statement-breakpoint
ALTER TABLE "course_purchase" ADD CONSTRAINT "course_purchase_unlock_token_unique" UNIQUE("unlock_token");