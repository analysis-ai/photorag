import { relations } from 'drizzle-orm';

import { emailRegister, images, imageVectors, users } from './tables';

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
  }),
  vectors: one(imageVectors, {
    fields: [images.id],
    references: [imageVectors.imageId]
  })
}));

export const imageVectorRelations = relations(imageVectors, ({ one }) => ({
  image: one(images, {
    fields: [imageVectors.imageId],
    references: [images.id]
  })
}));

export const userRelations = relations(users, ({ one, many }) => ({
  emailRegister: one(emailRegister, {
    fields: [users.email],
    references: [emailRegister.email]
  }),
  images: many(images),
  imageVectors: many(imageVectors)
}));
