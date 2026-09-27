// `@/utility/image` transitively imports the storage adapters, which pull
// in server-only ESM that jest cannot transform
jest.mock('../src/platforms/storage', () => ({
  getFileNamePartsFromStorageUrl: jest.fn(),
}));

import { fetchImageBytes } from '@/utility/image';

const MAX_BYTES = 1_000;

const mockFetchOnce = (response: Response) =>
  jest.spyOn(global, 'fetch').mockResolvedValueOnce(response);

describe('fetchImageBytes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects images larger than the limit', async () => {
    mockFetchOnce(new Response(new Uint8Array(10), {
      headers: { 'content-length': `${MAX_BYTES + 1}` },
    }));
    await expect(
      fetchImageBytes('https://example.com/photo.jpg', MAX_BYTES),
    ).rejects.toThrow('Image is too large');
  });

  it('reads images at the limit', async () => {
    mockFetchOnce(new Response(new Uint8Array(MAX_BYTES), {
      headers: { 'content-length': `${MAX_BYTES}` },
    }));
    const bytes = await fetchImageBytes(
      'https://example.com/photo.jpg',
      MAX_BYTES,
    );
    expect(bytes.byteLength).toBe(MAX_BYTES);
  });

  it('rejects responses that are not ok', async () => {
    mockFetchOnce(new Response(null, { status: 404 }));
    await expect(
      fetchImageBytes('https://example.com/photo.jpg', MAX_BYTES),
    ).rejects.toThrow('Fetch failed with status 404');
  });
});
