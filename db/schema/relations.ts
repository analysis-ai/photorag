import { relations } from 'drizzle-orm';

import { emailRegister, images, users } from './tables';

export const emailRegisterRelations = relations(emailRegister, ({ one }) => ({
  user: one(users, {
    fields: [emailRegister.email],
    references: [users.email]
  })
}));

export const imageRelations = relations(images, ({ one }) => ({
  user: one(users, {
    fields: [images.id],
    references: [users.id]
  })
}));

export const userRelations = relations(users, ({ one, many }) => ({
  emailRegister: one(emailRegister, {
    fields: [users.email],
    references: [emailRegister.email]
  }),
  images: many(images)
}));
