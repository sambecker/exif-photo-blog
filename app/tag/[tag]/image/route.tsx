import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_TAG,
} from '@/image-response';
import TagImageResponse from '@/image-response/TagImageResponse';
import { getIBMPlexMonoMedium } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { getUniqueTags } from '@/photo/db/query';
import {
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
  IS_PRODUCTION,
} from '@/app/config';

export let generateStaticParams:
  (() => Promise<{ tag: string }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const tags = await getUniqueTags();
    return tags
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT)
      .map(({ tag }) => ({ tag }));
  };
}

export async function GET(
  _: Request,
  context: { params: Promise<{ tag: string }> },
) {
  const { tag } = await context.params;

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_PER_TAG, tag }),
    getIBMPlexMonoMedium(),
    getImageResponseCacheControlHeaders(),
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
    { width, height, fonts, headers },
  );
}
