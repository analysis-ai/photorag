import { defineConfig } from 'drizzle-kit';

require('dotenv').config({ path: ['.env.local', '.env'] });

export default defineConfig({
  schema: './db/schema',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL!
  }
});
