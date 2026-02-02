import PhotoImageResponse from '@/photo/PhotoImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET(
  _: Request,
  context: { params: Promise<{ photoId: string }> },
) {
  const { photoId } = await context.params;

  return cachedOgPhotoResponse(
    { photoId },
    photoId,
    ({ photos, ...args }) =>
      <PhotoImageResponse {...{ photo: photos[0], ...args }}/>,
    'medium',
  );
}
