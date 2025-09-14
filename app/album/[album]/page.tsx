import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getUniqueTags, getPhotosByAlbum } from '@/photo/query';
import { PATH_ROOT } from '@/app/path';
import { generateMetaForTag } from '@/tag';
import { getPhotosTagDataCached } from '@/tag/data';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { getAppText } from '@/i18n/state/server';
import AlbumOverview from '@/album/AlbumOverview';
import { getAlbumFromSlug } from '@/album/query';

const getPhotosTagDataCachedCached = cache((tag: string) =>
  getPhotosTagDataCached({ tag, limit: INFINITE_SCROLL_GRID_INITIAL}));

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'tags',
  'page',
  getUniqueTags,
  tags => tags.map(({ tag }) => ({ tag })),
);

interface AlbumProps {
  params: Promise<{ album: string }>
}

export async function generateMetadata({
  params,
}: AlbumProps): Promise<Metadata> {
  const { album: albumFromParams } = await params;

  const album = decodeURIComponent(albumFromParams);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosTagDataCachedCached(album);

  if (photos.length === 0) { return {}; }

  const appText = await getAppText();

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForTag(album, photos, appText, count, dateRange);

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

export default async function TagPage({
  params,
}:AlbumProps) {
  const { album: albumFromParams } = await params;

  const albumSlug = decodeURIComponent(albumFromParams);

  const album = await getAlbumFromSlug(albumSlug);

  if (!album) { redirect(PATH_ROOT); }

  const photos = await getPhotosByAlbum(album.id);

  return (
    <AlbumOverview {...{ album, photos, count: 1, dateRange: undefined }} />
  );
}
