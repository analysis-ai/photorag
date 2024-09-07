DROP INDEX IF EXISTS "idx_email_registers_email_uniq";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_email_registers_email_uniq" ON "email_registers" USING btree (lower("email"));