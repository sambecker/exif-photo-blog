import { createHash, sign } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

export const signImportRequest = (
  method,
  url,
  body,
  privateKey,
  timestamp = String(Date.now()),
) => {
  const hash = createHash('sha256').update(body).digest('hex');
  const message = `${method}\n${new URL(url).pathname}\n${timestamp}\n${hash}`;
  return {
    'x-import-timestamp': timestamp,
    'x-import-signature': sign(null, Buffer.from(message), privateKey)
      .toString('base64'),
  };
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
      key: { type: 'string' },
      title: { type: 'string' },
      visible: { type: 'boolean', default: false },
      hidden: { type: 'string', default: 'include' },
    },
  });
  const [command, file, ...extra] = positionals;
  if (
    !values.base || !values.key || extra.length ||
    (command !== 'upload' && command !== 'list') ||
    (command === 'upload' && !file) || (command === 'list' && file)
  ) {
    throw new Error(
      'Usage: --base URL --key PEM upload FILE [--title T] [--visible]' +
      ' | list [--hidden only|include|exclude]',
    );
  }

  const privateKey = await readFile(expandPath(values.key), 'utf8');
  const request = async (method, path, data) => {
    const url = new URL(path, values.base);
    const body = data === undefined ? '' : JSON.stringify(data);
    const response = await fetch(url, {
      method,
      headers: {
        ...signImportRequest(method, url, body, privateKey),
        'Content-Type': 'application/json',
      },
      ...method !== 'GET' && { body },
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
