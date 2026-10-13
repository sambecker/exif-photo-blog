/* eslint-disable max-len */
import {
  cloudflareR2Copy,
  cloudflareR2Delete,
  cloudflareR2Put,
} from '../src/platforms/storage/cloudflare-r2';
import { copyFile, moveFile } from '../src/platforms/storage';
import { convertUploadToPhoto } from '../src/photo/storage';

const URL_WEB = 'https://cdn.pusadolfo.com/upload-abc123.jpg';
const URL_PRIVATE = 'https://pub-xyz.r2.dev/upload-def456.jpg';

jest.mock('../src/platforms/storage/cloudflare-r2', () => ({
  cloudflareR2Copy: jest.fn(async () => 'https://cdn.pusadolfo.com/photo-x.jpg'),
  cloudflareR2Delete: jest.fn(async () => undefined),
  cloudflareR2Put: jest.fn(async () => 'https://cdn.pusadolfo.com/photo-x.jpg'),
  isUrlFromCloudflareR2: (url?: string) =>
    Boolean(url?.includes('cdn.pusadolfo.com') || url?.includes('r2.dev')),
  isUrlFromCloudflareR2Web: (url?: string) =>
    Boolean(url?.includes('cdn.pusadolfo.com')),
  HAS_CLOUDFLARE_R2_WEB_BUCKET: true,
  CLOUDFLARE_R2_BASE_URL_PUBLIC: 'https://pub-xyz.r2.dev',
  CLOUDFLARE_R2_WEB_BASE_URL_PUBLIC: 'https://cdn.pusadolfo.com',
}));

jest.mock('../src/photo/server', () => ({
  removeGpsData: jest.fn(async () => Buffer.from('stripped')),
}));

// Keep the test hermetic: the storage barrel eagerly imports the vercel-blob
// and aws-s3 providers (pulling in undici), which we don't exercise here.
jest.mock('../src/platforms/storage/vercel-blob', () => ({}));
jest.mock('../src/platforms/storage/aws-s3', () => ({
  isUrlFromAwsS3: () => false,
}));

describe('storage R2 bucket targeting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('copies a web-bucket origin with target "web"', async () => {
    await copyFile(URL_WEB, 'photo-x.jpg');
    expect(cloudflareR2Copy).toHaveBeenCalledWith(
      expect.any(String),
      'photo-x.jpg',
      false,
      'web',
    );
  });

  it('copies a private/r2.dev origin with target "private"', async () => {
    await copyFile(URL_PRIVATE, 'photo-x.jpg');
    expect(cloudflareR2Copy).toHaveBeenCalledWith(
      expect.any(String),
      'photo-x.jpg',
      false,
      'private',
    );
  });

  it('moving a web origin deletes from the web bucket (target "web")', async () => {
    await moveFile(URL_WEB, 'photo-x.jpg');
    expect(cloudflareR2Delete).toHaveBeenCalledWith(
      expect.any(String),
      'web',
    );
  });

  it('GPS-strips a web origin into the web bucket via cloudflareR2Put', async () => {
    await convertUploadToPhoto({
      urlOrigin: URL_WEB,
      fileBytes: new ArrayBuffer(8),
      shouldStripGpsData: true,
      shouldDeleteOrigin: false,
    });
    expect(cloudflareR2Put).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(String),
      'web',
    );
  });
});
