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
    ...data !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
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
  undefined,
  'text/plain',
  'application/x-www-form-urlencoded',
  'multipart/form-data; boundary=x',
])('rejects POST requests with Content-Type %s', async contentType => {
  const [presign, add] = handlers();
  const { addUpload } = require('../src/photo/add-upload');
  const { getSignedUrlForKey } = require('../src/platforms/storage');
  for (const [handler, path, data] of [
    [presign, 'presign', { extension: 'jpg' }],
    [add, 'add', {
      uploadUrl: 'https://storage.example/photos/upload-1234567890abcdef.jpg',
    }],
  ] as const) {
    const response = await handler(new Request(
      `https://photos.example/api/import/${path}`,
      {
        method: 'POST',
        ...contentType && { headers: { 'Content-Type': contentType } },
        body: JSON.stringify(data),
      },
    ));
    expect(response.status).toBe(415);
  }
  expect(getSignedUrlForKey).not.toHaveBeenCalled();
  expect(addUpload).not.toHaveBeenCalled();
});

it('accepts application/json with a charset', async () => {
  const [presign] = handlers();
  const response = await presign(new Request(
    'https://photos.example/api/import/presign',
    {
      method: 'POST',
      headers: { 'Content-Type': 'Application/JSON; charset=utf-8' },
      body: JSON.stringify({ extension: 'jpg' }),
    },
  ));
  expect(response.status).toBe(200);
});

it.each([
  ['jpg', 'jpg', 'image/jpeg'],
  ['JPG', 'jpg', 'image/jpeg'],
  ['jpeg', 'jpeg', 'image/jpeg'],
  ['JPEG', 'jpeg', 'image/jpeg'],
  ['png', 'png', 'image/png'],
  ['PNG', 'png', 'image/png'],
])(
  'presigns a .%s upload on the configured storage',
  async (extension, keyExtension, contentType) => {
    const [presign] = handlers();
    const response = await presign(requestFor('presign', { extension }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const key = `upload-1234567890abcdef.${keyExtension}`;
    expect(await response.json()).toEqual({
      uploadUrl: `https://storage.example/photos/${key}`,
      contentType,
      putUrl: 'https://storage.example/put',
    });
    const { getSignedUrlForKey } = require('../src/platforms/storage');
    expect(getSignedUrlForKey).toHaveBeenCalledWith(key, 'PUT');
  },
);

it.each(['exe', 'heic', 'webp', ''])(
  'rejects unsupported extension: %s',
  async extension => {
    const [presign] = handlers();
    expect((await presign(requestFor('presign', { extension }))).status)
      .toBe(400);
  },
);

it('hands Vercel Blob uploads to the admin client-token endpoint', async () => {
  process.env.NEXT_PUBLIC_STORAGE_PREFERENCE = 'vercel-blob';
  const [presign] = handlers();
  const response = await presign(requestFor('presign', { extension: 'jpg' }));
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    uploadUrl: 'https://storage.example/photos/upload-1234567890abcdef.jpg',
    contentType: 'image/jpeg',
    pathname: 'upload-1234567890abcdef.jpg',
    handleUploadUrl: '/api/storage/vercel-blob',
  });
  const { getSignedUrlForKey } = require('../src/platforms/storage');
  expect(getSignedUrlForKey).not.toHaveBeenCalled();
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
  expect((await add(requestFor('add', { uploadUrl }))).status).toBe(400);
  expect(addUpload).not.toHaveBeenCalled();
});

it.each([
  [undefined, 'private', 'true', 'false'],
  ['private', 'private', 'true', 'false'],
  ['default', 'default', 'false', 'false'],
  ['exclude', 'exclude', 'false', 'true'],
])(
  'adds a photo with visibility=%s',
  async (visibility, expected, hidden, excludeFromFeeds) => {
    const [, add] = handlers();
    const { addUpload } = require('../src/photo/add-upload');
    addUpload.mockResolvedValue({ id: 'newphoto', url: 'photo' });
    const uploadUrl =
      'https://storage.example/photos/upload-1234567890abcdef.jpg';
    const response = await add(requestFor('add', { uploadUrl, visibility }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      id: 'newphoto', url: 'photo', visibility: expected,
    });
    expect(addUpload).toHaveBeenCalledWith(expect.objectContaining({
      url: uploadUrl,
      hidden,
      excludeFromFeeds,
      shouldRevalidateAllKeysAndPaths: true,
    }));
  },
);

it.each(['hidden', 'public', true])(
  'rejects an invalid visibility: %s',
  async visibility => {
    const [, add] = handlers();
    const { addUpload } = require('../src/photo/add-upload');
    const uploadUrl =
      'https://storage.example/photos/upload-1234567890abcdef.jpg';
    expect((await add(requestFor('add', { uploadUrl, visibility }))).status)
      .toBe(400);
    expect(addUpload).not.toHaveBeenCalled();
  },
);

it('accepts upload URLs with uppercase extensions', async () => {
  const [, add] = handlers();
  const { addUpload } = require('../src/photo/add-upload');
  addUpload.mockResolvedValue({ id: 'newphoto', url: 'photo' });
  const uploadUrl =
    'https://storage.example/photos/upload-1234567890abcdef.JPEG';
  expect((await add(requestFor('add', { uploadUrl }))).status).toBe(200);
});

it('returns 422 when photo processing cannot add the upload', async () => {
  const [, add] = handlers();
  const { addUpload } = require('../src/photo/add-upload');
  addUpload.mockResolvedValue(undefined);
  const uploadUrl =
    'https://storage.example/photos/upload-1234567890abcdef.jpg';
  expect((await add(requestFor('add', { uploadUrl }))).status).toBe(422);
});

const listFor = async (search = '') => {
  const [, , list] = handlers();
  const { getPhotos } = require('../src/photo/query');
  getPhotos.mockResolvedValue([
    { id: 'a', url: 'a', hidden: true },
    { id: 'b', url: 'b', excludeFromFeeds: true },
    { id: 'c', url: 'c' },
  ]);
  return list(new Request(`https://photos.example/api/photos/list${search}`));
};

const LISTED_PHOTOS = {
  a: { id: 'a', url: 'a', title: '', visibility: 'private' },
  b: { id: 'b', url: 'b', title: '', visibility: 'exclude' },
  c: { id: 'c', url: 'c', title: '', visibility: 'default' },
};

it('lists all photos with their visibility', async () => {
  const response = await listFor();
  const { getPhotos } = require('../src/photo/query');
  expect(getPhotos).toHaveBeenCalledWith({ hidden: 'include', limit: 10_000 });
  expect(await response.json()).toEqual({
    photos: [LISTED_PHOTOS.a, LISTED_PHOTOS.b, LISTED_PHOTOS.c],
  });
});

it.each([
  ['?visibility=private', ['a']],
  ['?visibility=exclude', ['b']],
  ['?visibility=default', ['c']],
] as const)('lists photos filtered by %s', async (search, ids) => {
  const response = await listFor(search);
  expect(await response.json()).toEqual({
    photos: ids.map(id => LISTED_PHOTOS[id]),
  });
});

it.each([
  '?visibility=hidden',
  '?visibility=',
  '?visibility=private,exclude',
  '?visibility=private&visibility=default',
])(
  'rejects an invalid visibility filter: %s',
  async search => {
    expect((await listFor(search)).status).toBe(400);
  },
);
