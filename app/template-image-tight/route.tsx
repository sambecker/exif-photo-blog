import { MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT } from '@/image-response/size';
import TemplateImageResponse from
  '@/app/TemplateImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET() {
  return cachedOgPhotoResponse(
    'template-image-tight',
    { sortWithPriority: true, limit: MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT },
    args =>
      <TemplateImageResponse {...{
        ...args,
        includeHeader: false,
        outerMargin: 0,
      }}/>,
    'medium',
  );
}
