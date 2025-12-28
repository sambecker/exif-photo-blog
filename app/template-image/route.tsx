import { MAX_PHOTOS_TO_SHOW_TEMPLATE } from '@/image-response/size';
import TemplateImageResponse from '@/app/TemplateImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET() {
  return cachedOgPhotoResponse(
    'template-image',
    { sortWithPriority: true, limit: MAX_PHOTOS_TO_SHOW_TEMPLATE },
    args => <TemplateImageResponse {...args} />,
    'medium',
  );
}
