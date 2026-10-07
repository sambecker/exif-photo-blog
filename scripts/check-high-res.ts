/**
 * READ-ONLY check: lists photos and whether they have a high-res URL.
 *
 * Reports:
 *   - total photos
 *   - how many have `url_high_res` (NULL / empty = missing)
 *   - the id + title + low-res url of every photo MISSING high-res
 *   - optionally HEAD-checks each existing high-res URL to see if it actually
 *     resolves (pass `--verify` to enable; it only reads, never writes)
 *
 * Does NOT modify the database or any storage. Safe to run anytime.
 *
 * RUN:
 *   pnpm tsx scripts/check-high-res.ts
 *   pnpm tsx scripts/check-high-res.ts --verify
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const loadEnvLocal = () => {
  const envPath = resolve(process.cwd(), '.env.local');
  if (!existsSync(envPath)) { return; }
  for (const rawLine of readFileSync(envPath, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) { continue; }
    const match = line.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (!match) { continue; }
    const key = match[1];
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith('\'') && value.endsWith('\''))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) { process.env[key] = value; }
  }
};

loadEnvLocal();

const VERIFY = process.argv.includes('--verify');

interface PhotoRow {
  id: string
  title: string | null
  url: string
  url_high_res: string | null
}

async function run() {
  // Dynamic import AFTER env load so the pg Pool sees POSTGRES_URL.
  const { query } = await import('../src/platforms/postgres');

  const { rows } = await query<PhotoRow>(
    `SELECT id, title, url, url_high_res
     FROM photos
     ORDER BY title NULLS LAST`,
  );

  const missing = rows.filter(
    r => !r.url_high_res || r.url_high_res.trim() === '',
  );
  const present = rows.filter(
    r => r.url_high_res && r.url_high_res.trim() !== '',
  );

  console.log('\n──────── high-res check ────────');
  console.log(`total photos:            ${rows.length}`);
  console.log(`with high-res url:        ${present.length}`);
  console.log(`MISSING high-res url:     ${missing.length}`);
  console.log('────────────────────────────────\n');

  if (missing.length > 0) {
    console.log('Photos MISSING high-res (shown as: id | title | low-res url):');
    for (const p of missing) {
      console.log(`  ${p.id} | ${p.title ?? '(sin título)'} | ${p.url}`);
    }
    console.log('');
  }

  if (VERIFY && present.length > 0) {
    console.log('Verifying that existing high-res URLs actually resolve...');
    let ok = 0;
    let broken = 0;
    for (const p of present) {
      try {
        const res = await fetch(p.url_high_res as string, { method: 'HEAD' });
        if (res.ok) {
          ok += 1;
        } else {
          broken += 1;
          console.log(
            `  [${res.status}] ${p.id} | ${p.title ?? ''} | ${p.url_high_res}`,
          );
        }
      } catch (error) {
        broken += 1;
        console.log(`  [ERR] ${p.id} | ${p.title ?? ''} | ${p.url_high_res}`);
      }
    }
    console.log(`\nhigh-res URLs OK: ${ok}   broken/unreachable: ${broken}\n`);
  }

  process.exit(0);
}

run().catch((error) => {
  console.error('Check error:', error);
  process.exit(1);
});
