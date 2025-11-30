import { clearOgCache } from '@/image-response/cache';
import { cacheTag, revalidateTag } from 'next/cache';

const KEY_GLOBAL = 'global';

export const cacheTagGlobal = () => cacheTag(KEY_GLOBAL);

export const revalidateGlobalCache = async () => {
  revalidateTag(KEY_GLOBAL, 'max');
  await clearOgCache();
};
