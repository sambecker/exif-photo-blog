import { Photo, photoQuantityText } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import HiddenTag from './HiddenTag';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { getAppText } from '@/i18n/state/server';

export default async function HiddenHeader({
  photos,
  selectedPhoto,
  indexNumber,
  count,
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count: number
}) {
  const appText = await getAppText();
  return (
    <PhotoHeader
      key="HiddenHeader"
      entity={<HiddenTag contrast="high" />}
      entityDescription={photoQuantityText(count, appText, false, false)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
    />
  );
}
