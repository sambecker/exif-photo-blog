import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { getAppText } from '@/i18n/state/server';
import { Album, descriptionForAlbumPhotos } from '.';
import { safelyParseFormattedHtml } from '@/utility/html';
import PhotoAlbum from './PhotoAlbum';
import PhotoTag from '@/tag/PhotoTag';
import IconTag from '@/components/icons/IconTag';
import MaskedScroll from '@/components/MaskedScroll';

export default async function AlbumHeader({
  album,
  photos,
  tags = [],
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
  showAlbumMeta,
}: {
  album: Album
  photos: Photo[]
  tags?: string[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRangePostgres
  showAlbumMeta?: boolean
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
      entitySubhead={showAlbumMeta ? album.subhead : undefined}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      richContent={showAlbumMeta && album.description
        ? <div className="space-y-2">
          {tags.length > 0 &&
            <MaskedScroll className="flex items-center gap-1.5">
              <IconTag className="text-dim translate-y-[1.5px]" />
              {tags.map(tag => (
                <PhotoTag
                  key={tag}
                  tag={tag}
                  badged
                  type="text-only"
                  prefetch={false}
                  contrast="low"
                />
              ))}
            </MaskedScroll>}
          <div
            className="text-medium [&>a]:underline"
            dangerouslySetInnerHTML={{
              __html: safelyParseFormattedHtml(album.description),
            }}
          />
        </div>
        : undefined}
      hasAiTextGeneration={AI_CONTENT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
