/**
 * Apply a raw SQL migration file against DATABASE_URL.
 *
 * Exists because the drizzle meta snapshots in this repo are corrupt, so
 * drizzle-kit generate/migrate cannot run. The SQL is additive only.
 *
 *   node --env-file=.env.local scripts/apply-migration.mjs drizzle/0002_...sql
 */
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/apply-migration.mjs <path-to-sql>');
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(url);
const contents = readFileSync(file, 'utf8');

// Split on semicolons at end of line, ignoring comment-only lines.
const statements = contents
  .split(/;\s*$/m)
  .map((s) =>
    s
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n')
      .trim(),
  )
  .filter(Boolean);

console.log(`Applying ${statements.length} statements from ${file}`);

for (const [index, statement] of statements.entries()) {
  const preview = statement.replace(/\s+/g, ' ').slice(0, 90);
  try {
    await sql(statement);
    console.log(`  ok   [${index + 1}] ${preview}`);
  } catch (error) {
    console.error(`  FAIL [${index + 1}] ${preview}`);
    console.error(`       ${error.message}`);
    process.exit(1);
  }
}

console.log('Migration applied.');
