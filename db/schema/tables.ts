import { sql, SQL } from 'drizzle-orm';
import {
  AnyPgColumn,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

// custom lower function
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export const emailRegister = pgTable(
  'email_registers',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    name: text('name').notNull(),
    token: uuid('token').notNull().defaultRandom(),
    emailVerified: timestamp('email_verified', {
      precision: 6,
      withTimezone: true
    }),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  (table) => {
    return {
      idxEmailUniq: uniqueIndex('idx_email_registers_email_uniq').on(
        lower(table.email)
      ),
      idxToken: index('idx_email_registers_token').using('btree', table.token)
    };
  }
);

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerified: timestamp('email_verified', {
      precision: 6,
      withTimezone: true
    }),
    created: timestamp('created', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated: timestamp('updated', { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date())
  },
  (table) => {
    return {
      idxEmailUniq: uniqueIndex('idx_users_email_uniq').on(lower(table.email))
    };
  }
);
