/** @jest-environment node */
import { createHash, generateKeyPairSync, sign } from 'node:crypto';

// Isolate storage, DB, and image processing; config and auth remain real.
jest.mock('../src/platforms/storage', () => ({
  baseUrlForStorage: () => 'https://storage.example/photos',
  generateFileNameWithId: () => 'upload-1234567890abcdef',
  getSignedUrlForKey: jest.fn(async () => 'https://storage.example/put'),
}));
jest.mock('../src/photo/add-upload', () => ({ addUpload: jest.fn() }));
jest.mock('../src/photo/query', () => ({ getPhotos: jest.fn() }));

const { publicKey, privateKey } = generateKeyPairSync('ed25519');
const pem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
const originalKey = process.env.IMPORT_PUBLIC_KEY;
const originalStorage = process.env.NEXT_PUBLIC_STORAGE_PREFERENCE;

const requestFor = (path: string, data?: unknown) => {
  const method = data === undefined ? 'GET' : 'POST';
  const body = data === undefined ? '' : JSON.stringify(data);
  const timestamp = String(Date.now());
  const hash = createHash('sha256').update(body).digest('hex');
  const message = `${method}\n/api/import/${path}\n${timestamp}\n${hash}`;
  return new Request(`https://photos.example/api/import/${path}`, {
    method,
    headers: {
      'x-import-timestamp': timestamp,
      'x-import-signature': sign(null, Buffer.from(message), privateKey)
        .toString('base64'),
    },
    ...method !== 'GET' && { body },
  });
};

beforeEach(() => {
  jest.resetModules();
  process.env.IMPORT_PUBLIC_KEY = pem;
  process.env.NEXT_PUBLIC_STORAGE_PREFERENCE = 'minio';
});

afterAll(() => {
  if (originalKey === undefined) { delete process.env.IMPORT_PUBLIC_KEY; }
  else { process.env.IMPORT_PUBLIC_KEY = originalKey; }
  if (originalStorage === undefined) {
    delete process.env.NEXT_PUBLIC_STORAGE_PREFERENCE;
  } else { process.env.NEXT_PUBLIC_STORAGE_PREFERENCE = originalStorage; }
});

const handlers = () => [
  require('../app/api/import/presign/route').POST,
  require('../app/api/import/add/route').POST,
  require('../app/api/import/photos/route').GET,
];

it('returns 404 before reading a body when IMPORT_PUBLIC_KEY is unset',
  async () => {
    delete process.env.IMPORT_PUBLIC_KEY;
    for (const handler of handlers()) {
      const request = new Request('https://photos.example/api/import/photos');
      const readBody = jest.spyOn(request, 'arrayBuffer');
      expect((await handler(request)).status).toBe(404);
      expect(readBody).not.toHaveBeenCalled();
    }
  });

it('returns generic 401 responses when enabled without a valid signature',
  async () => {
    for (const handler of handlers()) {
      const response = await handler(new Request('https://photos.example'));
      expect(response.status).toBe(401);
      expect(await response.text()).toBe('Unauthorized');
    }
  });

it('presigns an upload object on the configured storage', async () => {
  const [presign] = handlers();
  const response = await presign(requestFor('presign', { extension: 'jpg' }));
  expect(response.status).toBe(200);
  expect(response.headers.get('Cache-Control')).toBe('no-store');
  expect(await response.json()).toEqual({
    uploadUrl: 'https://storage.example/photos/upload-1234567890abcdef.jpg',
    putUrl: 'https://storage.example/put',
  });
  const { getSignedUrlForKey } = require('../src/platforms/storage');
  expect(getSignedUrlForKey).toHaveBeenCalledWith(
    'upload-1234567890abcdef.jpg', 'PUT',
  );
});

it('rejects unsupported extensions and Vercel Blob presigning', async () => {
  const [presign] = handlers();
  expect((await presign(requestFor('presign', { extension: 'exe' }))).status)
    .toBe(400);
  jest.resetModules();
  process.env.NEXT_PUBLIC_STORAGE_PREFERENCE = 'vercel-blob';
  const [blobPresign] = handlers();
  const response = await blobPresign(requestFor('presign', {
    extension: 'jpg',
  }));
  expect(response.status).toBe(400);
});

it.each([
  'https://evil.example/upload-1234567890abcdef.jpg',
  'https://storage.example.evil/photos/upload-1234567890abcdef.jpg',
  'https://storage.example/photos/photo-1234567890abcdef.jpg',
  'https://storage.example/photos/upload-1234567890abcdef.jpg?x=1',
  'https://storage.example/photos/../upload-1234567890abcdef.jpg',
])('rejects an invalid upload URL: %s', async uploadUrl => {
  const [, add] = handlers();
  const { addUpload } = require('../src/photo/add-upload');
  expect((await add(requestFor('add', { uploadUrl }))).status).toBe(400);
  expect(addUpload).not.toHaveBeenCalled();
});

it.each([undefined, false])('adds a photo with hidden=%s', async hidden => {
  const [, add] = handlers();
  const { addUpload } = require('../src/photo/add-upload');
  addUpload.mockResolvedValue({ id: 'newphoto', hidden: hidden ?? true });
  const uploadUrl =
    'https://storage.example/photos/upload-1234567890abcdef.jpg';
  const response = await add(requestFor('add', { uploadUrl, hidden }));
  expect(response.status).toBe(200);
  expect(addUpload).toHaveBeenCalledWith(expect.objectContaining({
    url: uploadUrl,
    hidden: String(hidden ?? true),
    excludeFromFeeds: 'false',
    shouldRevalidateAllKeysAndPaths: true,
  }));
});

it('returns 422 when photo processing cannot add the upload', async () => {
  const [, add] = handlers();
  const { addUpload } = require('../src/photo/add-upload');
  addUpload.mockResolvedValue(undefined);
  const uploadUrl =
    'https://storage.example/photos/upload-1234567890abcdef.jpg';
  expect((await add(requestFor('add', { uploadUrl }))).status).toBe(422);
});

it('lists photos including hidden photos by default', async () => {
  const [, , list] = handlers();
  const { getPhotos } = require('../src/photo/query');
  getPhotos.mockResolvedValue([{ id: 'existing', url: 'photo', hidden: true }]);
  const response = await list(requestFor('photos'));
  expect(getPhotos).toHaveBeenCalledWith({ hidden: 'include', limit: 10_000 });
  expect(await response.json()).toEqual({ photos: [{
    id: 'existing', url: 'photo', title: '', hidden: true,
  }] });
});
