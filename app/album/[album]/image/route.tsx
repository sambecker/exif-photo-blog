import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import AlbumImageResponse from '@/album/AlbumImageResponse';
import { getAlbumFromSlug, getAlbumsWithMeta } from '@/album/query';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'albums',
  'image',
  getAlbumsWithMeta,
  albums => albums.map(({ album }) => ({ album: album.slug })),
);

export async function GET(
  _: Request,
  context: { params: Promise<{ album: string }> },
) {
  const { album: albumParam } = await context.params;

  const album = await getAlbumFromSlug(decodeURIComponent(albumParam));

  if (!album) { return new Response('Album not found', { status: 404 }); }

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY, album }),
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <AlbumImageResponse {...{
      album,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
