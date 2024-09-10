CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_path" text NOT NULL,
	"filename" text,
	"caption" text,
	"description" text,
	"metadata" jsonb DEFAULT '{}',
	"tags" text[],
	"description_vector" vector(1536),
	"image_vector" vector(512),
	"vector_model" text,
	"user_id" integer NOT NULL,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "images_file_path_unique" UNIQUE("file_path")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_images_user_id" ON "images" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_images_description_gin" ON "images" USING gin (to_tsvector('english', "description"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_images_tags_gin" ON "images" USING gin ("tags");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cosine_description_index" ON "images" USING hnsw ("description_vector" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cosine_image_index" ON "images" USING hnsw ("image_vector" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "l2_image_index" ON "images" USING hnsw ("image_vector" vector_l2_ops);