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
  require('../app/api/photos/list/route').GET,
];

it('returns generic 401 responses without an admin session', async () => {
  require('../src/auth/server').auth.mockResolvedValue(null);
  for (const handler of handlers()) {
    const response = await handler(new Request('https://photos.example'));
    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  }
});

it.each([
  'https://evil.example/upload-1234567890abcdef.jpg',
  'https://storage.example.evil/photos/upload-1234567890abcdef.jpg',
  'https://storage.example/photos/photo-1234567890abcdef.jpg',
  'https://storage.example/photos/upload-1234567890abcdef.jpg?x=1',
  'https://storage.example/photos/../upload-1234567890abcdef.jpg',
  'https://storage.example/photos/upload-1234567890abcdef.heic',
  'https://storage.example/photos/upload-1234567890abcdef',
])('rejects an invalid upload URL: %s', async uploadUrl => {
  const [, add] = handlers();
  const { addUpload } = require('../src/photo/add-upload');
  const response = await add(new Request(
    'https://photos.example/api/import/add',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadUrl }),
    },
  ));
  expect(response.status).toBe(400);
  expect(addUpload).not.toHaveBeenCalled();
});
