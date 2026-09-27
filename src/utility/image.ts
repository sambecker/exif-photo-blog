import { getFileNamePartsFromStorageUrl } from '@/platforms/storage';

export const removeBase64Prefix = (base64: string) => {
  return base64.match(/^data:image\/[a-z]{3,4};base64,(.+)$/)?.[1] ?? base64;
};

// Buffers an image, refusing to exceed `maxBytes`, so that oversized
// photos fail fast instead of exhausting serverless memory
export const fetchImageBytes = async (
  url: string,
  maxBytes: number,
): Promise<ArrayBuffer> => {
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  // Cloud storage providers report `content-length` on GET, allowing most
  // oversized images to be rejected before the body is read
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error(`Image is too large (${contentLength} bytes)`);
  }

  // Stream in order to enforce the limit when `content-length` is absent
  const reader = response.body?.getReader?.();
  if (!reader) {
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > maxBytes) {
      throw new Error(`Image is too large (${bytes.byteLength} bytes)`);
    }
    return bytes;
  }

  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  let result = await reader.read();
  while (!result.done) {
    byteLength += result.value.byteLength;
    if (byteLength > maxBytes) {
      await reader.cancel();
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
};

export const fetchBase64ImageFromUrl = async (
  url: string,
  fetchOptions?: RequestInit,
) => {
  const { fileExtension } = getFileNamePartsFromStorageUrl(url);
  const contentType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
  return fetch(url, fetchOptions)
    .then(async response => {
      if (response.ok) {
        const blob = await response.arrayBuffer();
        // eslint-disable-next-line max-len
        return `data:${contentType};base64,${Buffer.from(blob).toString('base64')}`;
      } else {
        return undefined;
      }
    })
    .catch(() => undefined);
};
