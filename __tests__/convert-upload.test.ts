/* eslint-disable max-len */
import { convertUploadToPhoto } from '../src/photo/storage';
import { removeGpsData } from '../src/photo/server';

jest.mock('../src/photo/server', () => ({
  removeGpsData: jest.fn(),
}));

// Keep the test hermetic: the storage barrel eagerly imports the vercel-blob
// and aws-s3 providers (pulling in undici), which we don't exercise here.
jest.mock('../src/platforms/storage/vercel-blob', () => ({}));
jest.mock('../src/platforms/storage/aws-s3', () => ({
  isUrlFromAwsS3: () => false,
}));
jest.mock('../src/platforms/storage/cloudflare-r2', () => ({
  isUrlFromCloudflareR2Web: (url?: string) =>
    Boolean(url?.includes('cdn.pusadolfo.com')),
  HAS_CLOUDFLARE_R2_WEB_BUCKET: false,
  cloudflareR2Put: jest.fn(async () => 'https://cdn.pusadolfo.com/photo-x.jpg'),
}));

const URL_ORIGIN = 'https://cdn.pusadolfo.com/upload-abc123.jpg';

describe('convertUploadToPhoto error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // @ts-expect-error allow cleanup of the mocked global
    delete global.fetch;
  });

  it('rejects with a readable Spanish Error when the origin HEAD is 404', async () => {
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 404,
    })) as unknown as typeof fetch;

    await expect(convertUploadToPhoto({ urlOrigin: URL_ORIGIN }))
      .rejects.toThrow(/^No se pudo procesar la imagen/);
  });

  it('re-throws a readable Spanish Error when removeGpsData fails', async () => {
    (removeGpsData as jest.Mock).mockRejectedValueOnce(
      new Error('sharp exploded'),
    );

    await expect(convertUploadToPhoto({
      urlOrigin: URL_ORIGIN,
      fileBytes: new ArrayBuffer(8),
      shouldStripGpsData: true,
    }))
      .rejects.toThrow(/^No se pudo procesar la imagen: sharp exploded/);
  });
});
