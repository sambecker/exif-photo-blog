import { cache } from 'react';
import { headers } from 'next/headers';
import {
  IMMICH_SHARE_ALBUM_ID_HEADER,
  IMMICH_SHARE_KEY_HEADER,
} from '@/app/paths';
import { IMMICH_DEFAULT_SHARE_KEY } from '@/app/config';

export const getAlbumId = cache(async (): Promise<string> => {
  const albumId = (await headers()).get(IMMICH_SHARE_ALBUM_ID_HEADER);
  return albumId || '';
});

export const getSharedKey = cache(async (): Promise<string> => {
  const shareKey = (await headers()).get(IMMICH_SHARE_KEY_HEADER);
  return shareKey || IMMICH_DEFAULT_SHARE_KEY || '';
});