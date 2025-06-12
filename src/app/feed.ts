import { descriptionForPhoto, Photo, titleForPhoto } from '@/photo';
import { absolutePathForPhoto } from './paths';
import {
  getNextImageUrlForRequest,
  NextImageSize,
} from '@/platforms/next-image';
import { formatDate, formatDateFromPostgresString } from '@/utility/date';

export const FEED_PHOTO_REQUEST_LIMIT = 40;

export const FEED_PHOTO_WIDTH_SMALL = 200;
export const FEED_PHOTO_WIDTH_MEDIUM = 640;
export const FEED_PHOTO_WIDTH_LARGE = 1200;

export interface PublicFeedJson {
  meta: {
    title: string
    url: string
  }
  photos: PublicFeedPhotoJson[]
}

export interface PublicFeedRss {
  meta: {
    title: string
    url: string
  }
  photos: PublicFeedPhotoRss[]
}

interface PublicFeedMedia {
  url: string
  width: number
  height: number
}

interface PublicFeedPhotoJson {
  id: string
  title?: string
  url: string
  make?: string
  model?: string
  tags?: string[]
  takenAtNaive: string
  src: Record<
    'small' | 'medium' | 'large',
    PublicFeedMedia
  >
}

interface PublicFeedPhotoRss {
  id: string
  title?: string
  description?: string
  link: string
  publicationDate: Date
  media: Record<
    'content' | 'thumb',
    PublicFeedMedia
  >
}

const generateFeedMedia = (
  photo: Photo,
  size: NextImageSize,
): PublicFeedMedia => ({
  url: getNextImageUrlForRequest({ imageUrl: photo.url, size }),
  width: size,
  height: Math.round(size / photo.aspectRatio),
});

const getCoreFeedFields = (photo: Photo) => ({
  id: photo.id,
  title: titleForPhoto(photo),
  description: descriptionForPhoto(photo),
});

export const formatPhotoForFeedJson = (photo: Photo): PublicFeedPhotoJson => ({
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

export const formatPhotoForFeedRss = (photo: Photo): PublicFeedPhotoRss => ({
  ...getCoreFeedFields(photo),
  link: absolutePathForPhoto({ photo }),
  publicationDate: photo.createdAt,
  media: {
    content: generateFeedMedia(photo, FEED_PHOTO_WIDTH_LARGE),
    thumb: generateFeedMedia(photo, FEED_PHOTO_WIDTH_MEDIUM),
  },
});

export const feedPhotoToXml = (photo: PublicFeedPhotoRss): string => {
  const formattedDate = formatDate({
    date: photo.publicationDate,
    length: 'rss',
  });
  return `<item>
    <title>${photo.title}</title>
    <link>${photo.link}</link>
    <pubDate>${formattedDate}</pubDate>
    <guid isPermaLink="true">${photo.link}</guid>
    <description>
      <![CDATA[${photo.description}]]>
    </description>
    <media:content url="${photo.media.content.url.replace(/&/g, '&amp;')}"
      type="image/jpeg"
      medium="image"
      width="${photo.media.content.width}"
      height="${photo.media.content.height}">
    <media:thumbnail url="${photo.media.thumb.url.replace(/&/g, '&amp;')}"
      width="${photo.media.thumb.width}"
      height="${photo.media.thumb.height}" />
    </media:content>
  </item>`;
};
