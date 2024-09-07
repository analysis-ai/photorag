CREATE TABLE IF NOT EXISTS "email_registers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email_verified" timestamp (6) with time zone,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp (6) with time zone,
	"created" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_email_registers_email_uniq" ON "email_registers" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_email_registers_token" ON "email_registers" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_email_uniq" ON "users" USING btree ("email");