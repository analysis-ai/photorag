import * as schema from '@/db/schema';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

require('dotenv').config({ path: ['.env.local', '.env'] });

// for migrations
export const migrationClient = postgres(process.env.DB_URL!, { max: 1 });
export const mDb = drizzle(migrationClient, { schema });

// for query purposes
export const queryClient = postgres(process.env.DB_URL!);
export const db = drizzle(queryClient, { schema });
