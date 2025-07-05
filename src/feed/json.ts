import { absolutePathForPhoto } from '@/app/paths';
import {
  FEED_PHOTO_WIDTH_LARGE,
  FEED_PHOTO_WIDTH_MEDIUM,
  FEED_PHOTO_WIDTH_SMALL,
  FeedMedia,
  generateFeedMedia,
  getCoreFeedFields,
} from './programmatic';
import { formatDateFromPostgresString } from '@/utility/date';
import { Photo } from '@/photo';
import { BASE_URL, META_DESCRIPTION, META_TITLE } from '@/app/config';

interface FeedPhotoJson {
  id: string
  title: string
  url: string
  make?: string
  model?: string
  tags?: string[]
  takenAtNaive: string
  src: Record<'small' | 'medium' | 'large', FeedMedia>
}

const formatPhotoForFeedJson = (photo: Photo): FeedPhotoJson => ({
  ...getCoreFeedFields(photo),
  url: absolutePathForPhoto({ photo }),
  ...photo.make && { make: photo.make },
  ...photo.model && { model: photo.model },
  ...photo.tags.length > 0 && { tags: photo.tags },
  takenAtNaive: formatDateFromPostgresString(photo.takenAtNaive),
  src: {
    small: generateFeedMedia(photo, FEED_PHOTO_WIDTH_SMALL),
    medium: generateFeedMedia(photo, FEED_PHOTO_WIDTH_MEDIUM),
    large: generateFeedMedia(photo, FEED_PHOTO_WIDTH_LARGE),
  },
});

export const formatFeedJson = (photos: Photo[]) => ({
  meta: {
    title: META_TITLE,
    url: BASE_URL,
    ...META_DESCRIPTION && { description: META_DESCRIPTION },
  },
  photos: photos.map(formatPhotoForFeedJson),
});
