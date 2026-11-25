import { Readable } from 'stream';

// Fetch only the leading bytes of a remote object, used to read image
// metadata (EXIF/XMP/MakerNote) without buffering the full file.
export const fetchUrlHeader = async (
  url: string,
  maxBytes: number,
): Promise<ArrayBuffer> => {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Range: `bytes=0-${maxBytes - 1}` },
  });

  if (!response.ok) {
    void response.body?.cancel().catch(() => undefined);
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  if (!response.body) {
    return new ArrayBuffer(0);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  try {
    // Cap the read even if the server ignores Range and streams everything.
    while (byteLength < maxBytes) {
      const { done, value } = await reader.read();
      if (done) { break; }
      const take = Math.min(value.byteLength, maxBytes - byteLength);
      chunks.push(take === value.byteLength ? value : value.slice(0, take));
      byteLength += take;
    }

    const bytes = new Uint8Array(byteLength);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return bytes.buffer;
  } finally {
    void reader.cancel().catch(() => undefined);
  }
};

// Fetch a remote object as a Node.js stream for piping into `sharp`,
// avoiding a full in-memory buffer.
export const fetchUrlStream = async (
  url: string,
): Promise<NodeJS.ReadableStream> => {
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    void response.body?.cancel().catch(() => undefined);
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  return Readable.fromWeb(response.body as never);
};
