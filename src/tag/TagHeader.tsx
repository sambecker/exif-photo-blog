import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoTag from './PhotoTag';
import { descriptionForTaggedPhotos, isTagFavs } from '.';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoFavs from './PhotoFavs';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
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
  dateRange?: PhotoDateRangePostgres
}) {
  const appText = await getAppText();
  return (
    <PhotoHeader
      tag={tag}
      entity={isTagFavs(tag) 
        ? <PhotoFavs
          contrast="high"
          hoverType="none"
        />
        : <PhotoTag
          tag={tag}
          contrast="high"
          hoverType="none"
          showAdminMenu
        />}
      entityVerb={appText.category.tagged}
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
      hasAiTextGeneration={AI_CONTENT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
