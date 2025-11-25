import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import AlbumImageResponse from '@/album/AlbumImageResponse';
import { getAlbumFromSlug, getAlbumsWithMeta } from '@/album/query';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';
import { getPhotos } from '@/photo/query';
import { Album } from '@/album';

export const generateStaticParams = async () =>
  staticallyGenerateCategoryIfConfigured(
    'albums',
    'image',
    getAlbumsWithMeta,
    albums => albums.map(({ album }) => ({ album: album.slug })),
  );

async function getCacheComponent(album: Album) {
  'use cache';
  cacheTag(KEY_PHOTOS);

  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotos({ limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY, album }),
    getIBMPlexMono(),
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
    { width, height, fonts },
  );
}

export async function GET(
  _: Request,
  context: { params: Promise<{ album: string }> },
) {
  const { album: albumParam } = await context.params;

  const album = await getAlbumFromSlug(decodeURIComponent(albumParam));

  if (!album) { return new Response('Album not found', { status: 404 }); }

  return getCacheComponent(album);
}
