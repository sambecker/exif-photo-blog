'use cache';

import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { PATH_ROOT } from '@/app/path';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { getAppText } from '@/i18n/state/server';
import AlbumOverview from '@/album/AlbumOverview';
import { Album, generateMetaForAlbum } from '@/album';
import { getPhotosAlbumData } from '@/album/data';
import {
  getAlbumFromSlugCached,
  getTagsForAlbumCached,
} from '@/album/cache';
import { getPhotosCached } from '@/photo/cache';
import { cacheTagGlobal } from '@/cache';
import { getAlbumsWithMeta } from '@/album/query';

const getPhotosAlbumDataCached = cache((album: Album) =>
  getPhotosAlbumData({ album, limit: INFINITE_SCROLL_GRID_INITIAL}));

export const generateStaticParams = async () =>
  staticallyGenerateCategoryIfConfigured(
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

  const album = await getAlbumFromSlugCached(albumSlug);

  if (!album) { return {}; }

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosAlbumDataCached(album);

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
  cacheTagGlobal();

  const { album: albumFromParams } = await params;

  const albumSlug = decodeURIComponent(albumFromParams);

  const album = await getAlbumFromSlugCached(albumSlug);

  if (!album) { redirect(PATH_ROOT); }

  const photos = await getPhotosCached({ album });

  const tags = await getTagsForAlbumCached(album.id);

  return (
    <AlbumOverview {...{
      album,
      photos,
      tags,
      count: photos.length,
    }} />
  );
}
