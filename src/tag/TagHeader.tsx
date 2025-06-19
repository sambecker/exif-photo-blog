import { Photo, PhotoDateRange } from '@/photo';
import PhotoTag from './PhotoTag';
import { descriptionForTaggedPhotos, isTagFavs } from '.';
import PhotoHeader from '@/photo/PhotoHeader';
import FavsTag from './FavsTag';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { getAppText } from '@/i18n/state/server';

export default async function TagHeader({
  tag,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  tag: string
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const appText = await getAppText();
  return (
    <PhotoHeader
      tag={tag}
      entity={isTagFavs(tag) 
        ? <FavsTag
          contrast="high"
          showTooltip={false}
        />
        : <PhotoTag
          tag={tag}
          contrast="high"
          showTooltip={false}
        />}
      entityVerb={appText.category.taggedPhotos}
      entityDescription={descriptionForTaggedPhotos(
        photos,
        appText,
        undefined,
        count,
      )}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
