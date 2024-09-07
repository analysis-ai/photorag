import { relations } from 'drizzle-orm';

import { emailRegister, users } from './tables';

export const emailRegisterRelations = relations(emailRegister, ({ one }) => ({
  user: one(users, {
    fields: [emailRegister.email],
    references: [users.email]
  })
}));
