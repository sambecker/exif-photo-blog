import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

// Request cookies from Set-Cookie headers, optionally filtered by name
// (ignoring `__Secure-`/`__Host-` prefixes and `.0`, `.1` chunk suffixes)
export const cookiesFrom = (response, name) => response.headers
  .getSetCookie()
  .map(cookie => cookie.split(';')[0])
  .filter(cookie => {
    const [key, value] = cookie.split('=');
    const baseName = key.replace(/^__(Secure|Host)-/, '').replace(/\.\d+$/, '');
    return value && (!name || baseName === name);
  })
  .join('; ');

// Standard Auth.js credentials sign-in (same provider as the admin sign-in)
export const signIn = async (base, email, password) => {
  const csrf = await fetch(new URL('/api/auth/csrf', base));
  if (!csrf.ok) {
    throw new Error(`GET /api/auth/csrf: HTTP ${csrf.status}`);
  }
  const { csrfToken } = await csrf.json();
  const callback = new URL('/api/auth/callback/credentials', base);
  const response = await fetch(callback, {
    method: 'POST',
    redirect: 'manual',
    headers: { Cookie: cookiesFrom(csrf) },
    body: new URLSearchParams({ csrfToken, email, password }),
  });
  const session = cookiesFrom(response, 'authjs.session-token');
  if (!session) {
    throw new Error('Sign-in failed: check ADMIN_EMAIL and ADMIN_PASSWORD');
  }
  return session;
};

const contentTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  heic: 'image/heic',
  webp: 'image/webp',
};

const expandPath = path => path.startsWith('~/')
  ? resolve(homedir(), path.slice(2))
  : resolve(path);

const main = async () => {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      base: { type: 'string' },
      title: { type: 'string' },
      visible: { type: 'boolean', default: false },
      hidden: { type: 'string', default: 'include' },
    },
  });
  const [command, file, ...extra] = positionals;
  if (
    !values.base || extra.length ||
    (command !== 'upload' && command !== 'list') ||
    (command === 'upload' && !file) || (command === 'list' && file)
  ) {
    throw new Error(
      'Usage: --base URL upload FILE [--title T] [--visible]' +
      ' | list [--hidden only|include|exclude]',
    );
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD');
  }
  const cookie = await signIn(values.base, ADMIN_EMAIL, ADMIN_PASSWORD);
  const request = async (method, path, data) => {
    const response = await fetch(new URL(path, values.base), {
      method,
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      ...data !== undefined && { body: JSON.stringify(data) },
    });
    if (!response.ok) {
      throw new Error(`${method} ${path}: HTTP ${response.status}`);
    }
    return response.json();
  };

  if (command === 'list') {
    if (!['only', 'include', 'exclude'].includes(values.hidden)) {
      throw new Error('Invalid --hidden: use only, include, or exclude');
    }
    const result = await request(
      'GET',
      `/api/import/photos?hidden=${values.hidden}`,
    );
    console.log(JSON.stringify(result));
    return;
  }

  const extension = extname(file).slice(1).toLowerCase();
  const contentType = contentTypes[extension];
  if (!contentType) {
    throw new Error('Supported extensions: jpg, jpeg, png, heic, webp');
  }
  const bytes = await readFile(expandPath(file));
  const { uploadUrl, putUrl } = await request(
    'POST', '/api/import/presign', { extension },
  );
  const uploaded = await fetch(putUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: bytes,
  });
  if (!uploaded.ok) {
    throw new Error(`Storage PUT: HTTP ${uploaded.status}`);
  }
  const photo = await request('POST', '/api/import/add', {
    uploadUrl,
    title: values.title,
    hidden: !values.visible,
  });
  console.log(JSON.stringify({
    file,
    id: photo.id,
    url: photo.url,
    hidden: photo.hidden,
    title: values.title ?? null,
  }));
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
