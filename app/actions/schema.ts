import { z } from 'zod';

export const RegisterEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' })
});
