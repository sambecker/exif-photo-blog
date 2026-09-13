import { unstable_cache } from 'next/cache';
import { getLibrary } from './query';
import { KEY_LIBRARY, KEY_PHOTOS } from '@/cache';

export const getLibraryCached =
  unstable_cache(
    getLibrary,
    [KEY_PHOTOS, KEY_LIBRARY],
  );
