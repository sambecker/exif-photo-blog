import { Photo, PhotoDateRange } from '@/photo';
import PhotoTag from '../tag/PhotoTag';
import { descriptionForTaggedPhotos } from '../tag';
import PhotoHeader from '@/photo/PhotoHeader';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { getAppText } from '@/i18n/state/server';
import { Album } from '.';
import { safelyParseFormattedHtml } from '@/utility/html';

export default async function AlbumHeader({
  album,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  album: Album
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const appText = await getAppText();
  return (
    <PhotoHeader
      tag={album.slug}
      entity={<PhotoTag
        tag={album.slug}
        contrast="high"
        showHover={false}
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
      richContent={album.description
        ? <div
          className="text-medium [&>a]:underline"
          dangerouslySetInnerHTML={{
            __html: safelyParseFormattedHtml(album.description),
          }}
        />
        : undefined}
      hasAiTextGeneration={AI_CONTENT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
