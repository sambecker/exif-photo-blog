import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import TagImageResponse from '@/tag/TagImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getUniqueTags } from '@/photo/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { cacheTag } from 'next/cache';
import { KEY_PHOTOS } from '@/cache';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'tags',
  'image',
  getUniqueTags,
  tags => tags.map(({ tag }) => ({ tag })),
);

async function getCacheComponent(tag: string) {
  'use cache';
  cacheTag(KEY_PHOTOS);

  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY, tag }),
    getIBMPlexMono(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <TagImageResponse {...{
      tag,
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
  context: { params: Promise<{ tag: string }> },
) {
  const { tag } = await context.params;

  return getCacheComponent(tag);
}
