import { unstable_cache } from 'next/cache';
import { getAbout } from './query';
import { KEY_ABOUT, KEY_PHOTOS } from '@/cache';

export const getAboutCached =
  unstable_cache(
    getAbout,
    [KEY_PHOTOS, KEY_ABOUT],
  );
