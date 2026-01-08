import { keyForCategory } from '@/category/key';
import {
  deleteFilesWithPrefix,
  putFile,
  storageUrlForKey,
} from '@/platforms/storage';

const OG_PREFIX = 'og-';
const OG_EXTENSION = '.png';
const OG_RESPONSE_CONFIG: ResponseInit = {
  headers: {
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=3600, immutable',
  },
};

export const cachedOgResponse = async (
  _categoryOrKey: Parameters<typeof keyForCategory>[0] | string,
  getOgResponse: () => Promise<Response>,
): Promise<Response> => {
  const categoryOrKey = typeof _categoryOrKey === 'string'
    ? _categoryOrKey
    : keyForCategory(_categoryOrKey);
  const key = `${OG_PREFIX}${categoryOrKey}`;
  const cachedResponse = await fetch(storageUrlForKey(key) + OG_EXTENSION);
  if (cachedResponse.ok) {
    return new Response(await cachedResponse.arrayBuffer(), OG_RESPONSE_CONFIG);
  } else {
    const response = await getOgResponse();
    const buffer = await response.arrayBuffer();
    await putFile(Buffer.from(buffer), key + OG_EXTENSION);
    return new Response(buffer, OG_RESPONSE_CONFIG);
  }
};

export const clearOgCache = () =>
  deleteFilesWithPrefix(OG_PREFIX);
