/**
 * Migrate low-res grid images from Vercel Blob to the public R2 web bucket.
 *
 * For every photo whose low-res `url` is a Vercel Blob URL, this downloads the
 * bytes from Blob and uploads (PutObject) them to the `parker-web` bucket under
 * the SAME key, then rewrites `photos.url` to the public CDN URL
 * (`https://cdn.pusadolfo.com/<key>`). The high-res original (`url_high_res`,
 * stored in the private `parker` bucket) is left UNTOUCHED.
 *
 * Cross-provider copy is done as download-then-put (NOT a server-side copy).
 *
 * PREREQUISITES (read from `.env.local` in the project root):
 *   - POSTGRES_URL
 *   - NEXT_PUBLIC_CLOUDFLARE_R2_ACCOUNT_ID
 *   - CLOUDFLARE_R2_ACCESS_KEY / CLOUDFLARE_R2_SECRET_ACCESS_KEY
 *   - NEXT_PUBLIC_CLOUDFLARE_R2_WEB_BUCKET        (e.g. `parker-web`)
 *   - NEXT_PUBLIC_CLOUDFLARE_R2_WEB_PUBLIC_DOMAIN (e.g. `cdn.pusadolfo.com`)
 *   - Vercel Blob must stay accessible for the duration of the migration
 *     (the originals are read from their existing Blob URLs).
 *
 * SAFETY: `--dry-run` is the DEFAULT. Nothing is written unless `--apply` is
 * passed. The migration is idempotent — photos whose `url` is already a
 * web-bucket URL are skipped — and each photo is processed in its own
 * try/catch so a single failure doesn't abort the run.
 *
 * RUN:
 *   # Preview (no writes — this is the default):
 *   pnpm migrate:blob-to-r2
 *   # Apply the migration:
 *   pnpm migrate:blob-to-r2 --apply
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

// Load `.env.local` into `process.env` before importing modules that read env.
// Minimal parser (the project has no dotenv dependency); existing env vars win.
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
    // Strip surrounding single or double quotes
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

// NOTE: `../src/platforms/postgres` and `../src/platforms/storage/cloudflare-r2`
// are imported DYNAMICALLY inside `migrate()` (after `loadEnvLocal()` runs).
// Static ESM imports are hoisted and evaluated before the top-level
// `loadEnvLocal()` call, which would make `postgres.ts` build its connection
// Pool while `process.env.POSTGRES_URL` is still empty (→ ECONNREFUSED on
// 127.0.0.1:5432). Dynamic import defers that evaluation until env is loaded.

interface PhotoRow {
  id: string
  url: string
}

const APPLY = process.argv.includes('--apply');

// Vercel Blob base URL, computed with the SAME logic as
// `src/platforms/storage/vercel-blob.ts` (duplicated here to keep this script
// free of the React-coupled storage barrel). Used to detect which `photos.url`
// values still live in Blob and to strip the key for the R2 upload.
const VERCEL_BLOB_STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();
const VERCEL_BLOB_BASE_URL = VERCEL_BLOB_STORE_ID
  ? `https://${VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com`
  : undefined;

const isVercelBlobUrl = (url: string) =>
  Boolean(VERCEL_BLOB_BASE_URL && url.startsWith(VERCEL_BLOB_BASE_URL));

// Mirrors `fileNameForStorageUrl` for Vercel Blob URLs
const keyForBlobUrl = (url: string) =>
  url.replace(`${VERCEL_BLOB_BASE_URL}/`, '');

const WEB_PUBLIC_DOMAIN = (
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_WEB_PUBLIC_DOMAIN ?? ''
)
  .replace(/^(?:https?:\/\/)?/i, '')
  .replace(/\/+$/, '');
const WEB_BASE_URL = WEB_PUBLIC_DOMAIN
  ? `https://${WEB_PUBLIC_DOMAIN}`
  : undefined;

async function migrate() {
  console.log(
    `\nBlob → parker-web migration (${APPLY ? 'APPLY' : 'DRY-RUN'})\n`,
  );

  // Dynamic imports AFTER loadEnvLocal() so env-dependent module init
  // (e.g. the pg Pool in postgres.ts) sees the loaded variables.
  const { query } = await import('../src/platforms/postgres');
  const { cloudflareR2Put } =
    await import('../src/platforms/storage/cloudflare-r2');

  if (!process.env.NEXT_PUBLIC_CLOUDFLARE_R2_WEB_BUCKET || !WEB_BASE_URL) {
    console.error(
      '❌ Missing NEXT_PUBLIC_CLOUDFLARE_R2_WEB_BUCKET and/or ' +
      'NEXT_PUBLIC_CLOUDFLARE_R2_WEB_PUBLIC_DOMAIN. Aborting.',
    );
    process.exit(1);
  }

  const { rows } = await query<PhotoRow>(
    'SELECT id, url FROM photos WHERE url IS NOT NULL',
  );

  let candidates = 0;
  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const { id, url } of rows) {
    // Skip anything already pointing at the web bucket (idempotency)
    if (WEB_BASE_URL && url.startsWith(WEB_BASE_URL)) {
      skipped += 1;
      continue;
    }

    // Only migrate low-res URLs that currently live in Vercel Blob
    if (!isVercelBlobUrl(url)) {
      skipped += 1;
      continue;
    }

    candidates += 1;
    const key = keyForBlobUrl(url);
    const newUrl = `${WEB_BASE_URL}/${key}`;

    if (!APPLY) {
      console.log(`[dry-run] ${id}: ${url} → ${newUrl}`);
      continue;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`download failed: ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());

      await cloudflareR2Put(buffer, key, 'web');

      await query(
        'UPDATE photos SET url = $1 WHERE id = $2',
        [newUrl, id],
      );

      migrated += 1;
      console.log(`[ok] ${id}: → ${newUrl}`);
    } catch (error) {
      failed += 1;
      console.error(`[fail] ${id}: ${url}`, error);
    }
  }

  console.log('\n──────── summary ────────');
  console.log(`total photos:        ${rows.length}`);
  console.log(`already migrated:    ${skipped}`);
  console.log(`candidates (blob):   ${candidates}`);
  if (APPLY) {
    console.log(`migrated:            ${migrated}`);
    console.log(`failed:              ${failed}`);
  } else {
    console.log('(dry-run — no changes written; pass --apply to migrate)');
  }
  console.log('─────────────────────────\n');

  process.exit(failed > 0 ? 1 : 0);
}

migrate().catch((error) => {
  console.error('❌ Migration error:', error);
  process.exit(1);
});
