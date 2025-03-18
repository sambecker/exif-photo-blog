import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import TagImageResponse from '@/image-response/TagImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { getUniqueTags } from '@/photo/db/query';
import { shouldGenerateStaticParamsForCategory } from '@/photo/set';

export let generateStaticParams:
  (() => Promise<{ tag: string }[]>) | undefined = undefined;

if (shouldGenerateStaticParamsForCategory('tags', 'image')) {
  generateStaticParams = async () => {
    const tags = await getUniqueTags();
    return tags
      .map(({ tag }) => ({ tag }))
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT);
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
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY, tag }),
    getIBMPlexMono(),
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
