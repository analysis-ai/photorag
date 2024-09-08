DROP INDEX IF EXISTS "idx_images_file_path_uniq";--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "file_path" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "file_path" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ALTER COLUMN "tags" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "filename" text;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_file_path_unique" UNIQUE("file_path");