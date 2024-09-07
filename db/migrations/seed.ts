import { mDb, migrationClient } from '@/db';

require('dotenv').config({ path: ['.env.local', '.env'] });

async function main() {
  await migrationClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
