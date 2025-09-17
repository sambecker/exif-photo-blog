import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getPhotos } from '@/photo/query';
import { PATH_ROOT } from '@/app/path';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { getAppText } from '@/i18n/state/server';
import AlbumOverview from '@/album/AlbumOverview';
import {
  getAlbumFromSlug,
  getAlbumsWithMeta,
  getTagsForAlbum,
} from '@/album/query';
import { Album, generateMetaForAlbum } from '@/album';
import { getPhotosAlbumDataCached } from '@/album/data';

const getPhotosAlbumDataCachedCached = cache((album: Album) =>
  getPhotosAlbumDataCached({ album, limit: INFINITE_SCROLL_GRID_INITIAL}));

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'albums',
  'page',
  getAlbumsWithMeta,
  albums => albums.map(({ album }) => ({ album: album.slug })),
);

interface AlbumProps {
  params: Promise<{ album: string }>
}

export async function generateMetadata({
  params,
}: AlbumProps): Promise<Metadata> {
  const { album: albumFromParams } = await params;

  const albumSlug = decodeURIComponent(albumFromParams);

  const album = await getAlbumFromSlug(albumSlug);

  if (!album) { return {}; }

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosAlbumDataCachedCached(album);

  if (photos.length === 0) { return {}; }

  const appText = await getAppText();

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForAlbum(album, photos, appText, count, dateRange);

  return {
    title,
    openGraph: {
      title,
      description,
      images,
      url,
    },
    twitter: {
      images,
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function AlbumPage({
  params,
}:AlbumProps) {
  const { album: albumFromParams } = await params;

  const albumSlug = decodeURIComponent(albumFromParams);

  const album = await getAlbumFromSlug(albumSlug);

  if (!album) { redirect(PATH_ROOT); }

  const photos = await getPhotos({ album });

  const tags = await getTagsForAlbum(album.id);

  return (
    <AlbumOverview {...{
      album,
      photos,
      tags,
      count: photos.length,
    }} />
  );
}
