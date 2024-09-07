import { execSync } from 'child_process';

require('dotenv').config({ path: ['.env.local', '.env'] });

async function main() {
  execSync('drizzle-kit migrate', { stdio: 'inherit' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
