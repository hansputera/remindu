ALTER TABLE "reminders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "reminders" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mylists" ADD COLUMN "status" varchar(20) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "mylists" ADD COLUMN "waiting_type" varchar(20) DEFAULT 'disabled' NOT NULL;--> statement-breakpoint
ALTER TABLE "mylists" ADD COLUMN "onEpisode" integer;--> statement-breakpoint
ALTER TABLE "mylists" ADD COLUMN "on_date" date;