import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import TagImageResponse from '@/tag/TagImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET(
  _: Request,
  context: { params: Promise<{ tag: string }> },
) {
  const { tag } = await context.params;

  return cachedOgPhotoResponse(
    { tag },
    { tag, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <TagImageResponse {...{ tag, ...args }}/>,
  );
}
