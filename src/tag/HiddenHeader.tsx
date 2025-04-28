import { Photo, photoQuantityText } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import HiddenTag from './HiddenTag';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';

export default function HiddenHeader({
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
  return (
    <PhotoHeader
      key="HiddenHeader"
      entity={<HiddenTag contrast="high" />}
      entityDescription={photoQuantityText(count, false)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
    />
  );
}
