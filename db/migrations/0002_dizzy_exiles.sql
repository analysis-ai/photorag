DROP INDEX IF EXISTS "idx_users_email_uniq";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_email_uniq" ON "users" USING btree (lower("email"));