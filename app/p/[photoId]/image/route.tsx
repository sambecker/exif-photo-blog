import PhotoImageResponse from '@/photo/PhotoImageResponse';
import { staticallyGeneratePhotosIfConfigured } from '@/app/static';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export const generateStaticParams = async () =>
  staticallyGeneratePhotosIfConfigured(
    'image',
  );

export async function GET(
  _: Request,
  context: { params: Promise<{ photoId: string }> },
) {
  const { photoId } = await context.params;

  return cachedOgPhotoResponse(
    `photo-${photoId}`,
    photoId,
    ({ photos, ...args }) =>
      <PhotoImageResponse {...{ photo: photos[0], ...args }}/>,
    'medium',
  );
}
