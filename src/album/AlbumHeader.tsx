import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import {
  AI_CONTENT_GENERATION_ENABLED,
  SHOW_CATEGORY_IMAGE_HOVERS,
} from '@/app/config';
import { getAppText } from '@/i18n/state/server';
import { Album, albumHasMeta, descriptionForAlbumPhotos } from '.';
import { safelyParseFormattedHtml } from '@/utility/html';
import PhotoAlbum from './PhotoAlbum';
import PhotoTag from '@/tag/PhotoTag';
import IconTag from '@/components/icons/IconTag';
import MaskedScroll from '@/components/MaskedScroll';
import PlaceEntity from '@/place/PlaceEntity';

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
        hoverType="none"
        showAdminMenu
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
      richContent={showAlbumMeta && (albumHasMeta(album) || tags.length > 0)
        ? <div className="space-y-2">
          {album.subhead &&
            <div className="text-medium mb-6 uppercase font-medium">
              {album.subhead}
            </div>}
          {(album.location || tags.length > 0) &&
            <MaskedScroll
              className="whitespace-nowrap space-x-1.5"
              direction="horizontal"
            >
              {album.location &&
                <PlaceEntity
                  place={album.location}
                  className="translate-x-[-2px] mr-1.5!"
                />}
              {tags.length > 0 && <>
                <IconTag
                  className="inline-block text-dim translate-y-[-0.5px]"
                />
                {tags.map(tag => (
                  <PhotoTag
                    key={tag}
                    tag={tag}
                    badged
                    type="text-only"
                    contrast="low"
                    hoverType={SHOW_CATEGORY_IMAGE_HOVERS ? 'image' : 'none'}
                    prefetch={false}
                  />
                ))}
              </>}
            </MaskedScroll>}
          {album.description &&
            <div
              className="text-medium [&>a]:underline"
              dangerouslySetInnerHTML={{
                __html: safelyParseFormattedHtml(album.description),
              }}
            />}
        </div>
        : undefined}
      hasAiTextGeneration={AI_CONTENT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
