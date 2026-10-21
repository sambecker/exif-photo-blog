import { fetchUrlWithByteLimit } from '@/utility/fetch';

const neverCancels = () => new Promise<void>(() => {});

afterEach(() => jest.restoreAllMocks());

describe('bounded image downloads', () => {
  it('reports HTTP failures without awaiting cancellation', async () => {
    const cancel = jest.fn(neverCancels);
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false, status: 503, body: { cancel },
    } as unknown as Response);
    await expect(fetchUrlWithByteLimit('https://example.test/photo', 100))
      .rejects.toThrow('Fetch failed with status 503');
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('rejects oversized headers without awaiting cancellation', async () => {
    const cancel = jest.fn(neverCancels);
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true, headers: new Headers({ 'content-length': '101' }),
      body: { cancel },
    } as unknown as Response);
    await expect(fetchUrlWithByteLimit('https://example.test/photo', 100))
      .rejects.toThrow('Image is too large');
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('enforces the streaming limit without awaiting cleanup', async () => {
    const reader = {
      read: jest.fn().mockResolvedValue({
        done: false, value: new Uint8Array(101),
      }),
      cancel: jest.fn(neverCancels),
    };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true, headers: new Headers(),
      body: { getReader: () => reader },
    } as unknown as Response);
    await expect(fetchUrlWithByteLimit('https://example.test/photo', 100))
      .rejects.toThrow('Image is too large');
    expect(reader.read).toHaveBeenCalledTimes(1);
    expect(reader.cancel).toHaveBeenCalledTimes(1);
  });
});
