/** @jest-environment node */

// Isolate auth, storage, DB, image processing, and ESM-heavy modules;
// config remains real.
jest.mock('../src/auth/server', () => ({
  auth: jest.fn(async () => ({ user: { email: 'admin@example.com' } })),
}));
jest.mock('../src/platforms/storage', () => ({
  baseUrlForStorage: () => 'https://storage.example/photos',
  generateFileNameWithId: () => 'upload-1234567890abcdef',
  getSignedUrlForKey: jest.fn(async () => 'https://storage.example/put'),
}));
jest.mock('../src/photo', () => ({
  ACCEPTED_PHOTO_FILE_TYPES: ['image/jpg', 'image/jpeg', 'image/png'],
}));
jest.mock('../src/app/path', () => ({
  PATH_API_VERCEL_BLOB_UPLOAD: '/api/storage/vercel-blob',
}));
jest.mock('../src/photo/add-upload', () => ({ addUpload: jest.fn() }));
jest.mock('../src/photo/query', () => ({ getPhotos: jest.fn() }));

const originalStorage = process.env.NEXT_PUBLIC_STORAGE_PREFERENCE;

const requestFor = (path: string, data?: unknown) => {
  return new Request(`https://photos.example/api/import/${path}`, {
    method: data === undefined ? 'GET' : 'POST',
    ...data !== undefined && { body: JSON.stringify(data) },
  });
};

beforeEach(() => {
  jest.resetModules();
  process.env.NEXT_PUBLIC_STORAGE_PREFERENCE = 'minio';
});

afterAll(() => {
  if (originalStorage === undefined) {
    delete process.env.NEXT_PUBLIC_STORAGE_PREFERENCE;
  } else { process.env.NEXT_PUBLIC_STORAGE_PREFERENCE = originalStorage; }
});

const handlers = () => [
  require('../app/api/import/presign/route').POST,
  require('../app/api/import/add/route').POST,
  require('../app/api/import/photos/route').GET,
];

it('returns generic 401 responses without an admin session', async () => {
  require('../src/auth/server').auth.mockResolvedValue(null);
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

it('rejects unsupported extensions', async () => {
  const [presign] = handlers();
  expect((await presign(requestFor('presign', { extension: 'exe' }))).status)
    .toBe(400);
});

it('hands Vercel Blob uploads to the admin client-token endpoint', async () => {
  process.env.NEXT_PUBLIC_STORAGE_PREFERENCE = 'vercel-blob';
  const [presign] = handlers();
  const response = await presign(requestFor('presign', { extension: 'jpg' }));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    uploadUrl: 'https://storage.example/photos/upload-1234567890abcdef.jpg',
    pathname: 'upload-1234567890abcdef.jpg',
    handleUploadUrl: '/api/storage/vercel-blob',
  });
  const { getSignedUrlForKey } = require('../src/platforms/storage');
  expect(getSignedUrlForKey).not.toHaveBeenCalled();
  // Admin client tokens only allow jpg/png
  expect((await presign(requestFor('presign', { extension: 'heic' }))).status)
    .toBe(400);
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
