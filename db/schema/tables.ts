import {
  AnyPgColumn,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  vector
} from 'drizzle-orm/pg-core';
import { SQL, sql } from 'drizzle-orm';

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

export const images = pgTable(
  'images',
  {
    id: serial('id').primaryKey(),
    filePath: varchar('file_path', { length: 255 }),
    description: text('description'),
    tags: varchar('tags', { length: 255 }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
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
      idxFilePathUniq: uniqueIndex('idx_images_file_path_uniq').on(
        table.filePath
      ),
      idxUserId: index('idx_images_user_id').on(table.userId),
      idxDescriptionGin: index('idx_images_description_gin').using(
        'gin',
        sql`to_tsvector('english', ${table.description})`
      ),
      idxTagsGin: index('idx_images_tags_gin').using(
        'gin',
        sql`to_tsvector('english', ${table.tags})`
      )
    };
  }
);

export const imageVectors = pgTable(
  'image_vectors',
  {
    id: serial('id').primaryKey(),
    imageId: integer('image_id')
      .references(() => images.id)
      .unique(),
    descriptionVector: vector('description_vector', { dimensions: 1536 }),
    imageVector: vector('image_vector', { dimensions: 512 })
  },
  (table) => ({
    cosineDescription: index('cosine_description_index').using(
      'hnsw',
      table.descriptionVector.op('vector_cosine_ops')
    ),
    cosineImage: index('cosine_image_index').using(
      'hnsw',
      table.imageVector.op('vector_cosine_ops')
    ),
    l2Image: index('l2_image_index').using(
      'hnsw',
      table.imageVector.op('vector_l2_ops')
    )
  })
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
