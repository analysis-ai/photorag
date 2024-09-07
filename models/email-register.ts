'use server';

import { db } from '@/db';
import { emailRegister, lower } from '@/db/schema';
import { eq } from 'drizzle-orm';

type RegisteredEmail = typeof emailRegister.$inferSelect;

type RegisterResult = {
  status: 'success' | 'error' | 'duplicate';
  message: string;
  data: RegisteredEmail | null;
};

export const addNewSubscriber = async (
  email: string,
  name: string
): Promise<RegisterResult> => {
  // Check if email already exists
  const existingEmail = await db.query.emailRegister.findFirst({
    where: eq(lower(emailRegister.email), email.toLowerCase())
  });

  if (existingEmail) {
    return {
      status: 'duplicate',
      message: 'Email already registered',
      data: existingEmail
    };
  }

  const [result] = await db
    .insert(emailRegister)
    .values({
      email,
      name
    })
    .returning();

  if (!result) {
    return { status: 'error', message: 'Error registering email', data: null };
  } else {
    return {
      status: 'success',
      message: 'Email registered successfully',
      data: result
    };
  }
};

export const verifyByToken = async (token: string) => {
  const registeredEmail = await db.query.emailRegister.findFirst({
    where: eq(emailRegister.token, token)
  });

  if (!registeredEmail) {
    throw new Error('Cannot find email by token');
  }

  const [record] = await db
    .update(emailRegister)
    .set({
      emailVerified: new Date()
    })
    .where(eq(emailRegister.token, token))
    .returning();

  if (!record) {
    throw new Error('Error verifying email by token');
  }

  return record;
};
