/**
 * @jest-environment node
 */
// `@/utility/image` transitively imports the storage adapters, which pull
// in server-only ESM that jest cannot transform
jest.mock('../src/platforms/storage', () => ({
  getFileNamePartsFromStorageUrl: jest.fn(),
}));

import { fetchUrlWithByteLimit } from '@/utility/fetch';

const MAX_BYTES = 1_000;

const mockFetchOnce = (response: Response) =>
  jest.spyOn(global, 'fetch').mockResolvedValueOnce(response);

const streamFromChunks = (...chunks: Uint8Array[]) => {
  let index = 0;
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index >= chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(chunks[index]);
      index += 1;
    },
  });
};

describe('fetchImageBytes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('rejects images larger than the limit', async () => {
    mockFetchOnce(new Response(new Uint8Array(10), {
      headers: { 'content-length': `${MAX_BYTES + 1}` },
    }));
    await expect(
      fetchUrlWithByteLimit('https://example.com/photo.jpg', MAX_BYTES),
    ).rejects.toThrow('Image is too large');
  });

  it('reads images at the limit', async () => {
    mockFetchOnce(new Response(new Uint8Array(MAX_BYTES), {
      headers: { 'content-length': `${MAX_BYTES}` },
    }));
    const bytes = await fetchUrlWithByteLimit(
      'https://example.com/photo.jpg',
      MAX_BYTES,
    );
    expect(bytes.byteLength).toBe(MAX_BYTES);
  });

  it('rejects responses that are not ok', async () => {
    mockFetchOnce(new Response(null, { status: 404 }));
    await expect(
      fetchUrlWithByteLimit('https://example.com/photo.jpg', MAX_BYTES),
    ).rejects.toThrow('Fetch failed with status 404');
  });

  // eslint-disable-next-line @stylistic/max-len
  it('rejects a body over the limit when content-length is absent', async () => {
    const response = new Response(streamFromChunks(
      new Uint8Array(MAX_BYTES),
      new Uint8Array(1),
    ));
    expect(response.headers.get('content-length')).toBeNull();
    mockFetchOnce(response);
    await expect(
      fetchUrlWithByteLimit('https://example.com/photo.jpg', MAX_BYTES),
    ).rejects.toThrow('Image is too large');
  });

  it('rejects a body larger than an understated content-length', async () => {
    mockFetchOnce(new Response(streamFromChunks(
      new Uint8Array(MAX_BYTES),
      new Uint8Array(1),
    ), {
      headers: { 'content-length': '1' },
    }));
    await expect(
      fetchUrlWithByteLimit('https://example.com/photo.jpg', MAX_BYTES),
    ).rejects.toThrow('Image is too large');
  });
});
