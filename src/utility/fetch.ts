export const fetchUrlWithByteLimit = async (
  url: string,
  maxBytes: number,
): Promise<ArrayBuffer> => {
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  // Cloud storage providers report `content-length` on GET, allowing most
  // oversized images to be rejected before the body is read. The stream
  // below is what enforces the cap when the header is missing or too small.
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error(`Image is too large (${contentLength} bytes)`);
  }

  if (!response.body) {
    return new ArrayBuffer(0);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  try {
    let result = await reader.read();
    while (!result.done) {
      byteLength += result.value.byteLength;
      if (byteLength > maxBytes) {
        throw new Error(`Image is too large (max ${maxBytes} bytes)`);
      }
      chunks.push(result.value);
      result = await reader.read();
    }

    const bytes = new Uint8Array(byteLength);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return bytes.buffer;
  } finally {
    await reader.cancel().catch(() => undefined);
  }
};
