import { MAX_PHOTOS_TO_SHOW_OG } from '@/image-response/size';
import HomeImageResponse from '@/app/HomeImageResponse';
import { APP_OG_IMAGE_QUERY_OPTIONS } from '@/feed';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET() {
  return cachedOgPhotoResponse(
    'home-image',
    { ...APP_OG_IMAGE_QUERY_OPTIONS, limit: MAX_PHOTOS_TO_SHOW_OG },
    args => <HomeImageResponse {...args} />,
  );
}
