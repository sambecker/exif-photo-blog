import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { getAppText } from '@/i18n/state/server';
import { Album, descriptionForAlbumPhotos } from '.';
import { safelyParseFormattedHtml } from '@/utility/html';
import PhotoAlbum from './PhotoAlbum';

export default async function AlbumHeader({
  album,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
  showAlbumDescription,
}: {
  album: Album
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRangePostgres
  showAlbumDescription?: boolean
}) {
  const appText = await getAppText();
  return (
    <PhotoHeader
      album={album}
      entity={<PhotoAlbum
        album={album}
        contrast="high"
        showHover={false}
      />}
      entityDescription={descriptionForAlbumPhotos(
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
      richContent={showAlbumDescription && album.description
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
