import { mDb, migrationClient } from '@/db';

import { sql } from 'drizzle-orm';

require('dotenv').config({ path: ['.env.local', '.env'] });

const dbUser = process.env.PG_USER || 'no-pg-user-env-set';

async function main() {
  await mDb.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE;`));

  await mDb.execute(sql.raw(`DROP SCHEMA public CASCADE;`));
  await mDb.execute(sql.raw(`CREATE SCHEMA public;`));

  await mDb.execute(
    sql.raw(`GRANT ALL ON SCHEMA public TO ${dbUser};`)
  );

  await mDb.execute(sql.raw(`GRANT ALL ON SCHEMA public TO public;`));
  await mDb.execute(
    sql.raw(`COMMENT ON SCHEMA public IS 'standard public schema';`)
  );

  await migrationClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
