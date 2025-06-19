ALTER TABLE "user" ADD COLUMN "polar_user_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "polar_access_token" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "polar_refresh_token" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "polar_token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "polar_connected_at" timestamp;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "polar_product_id" text;--> statement-breakpoint
ALTER TABLE "course" ADD COLUMN "polar_product_slug" text;