import { descriptionForPhoto, Photo, titleForPhoto } from '@/photo';
import { absolutePathForPhoto } from './paths';
import {
  getNextImageUrlForRequest,
  NextImageSize,
} from '@/platforms/next-image';
import { formatDate, formatDateFromPostgresString } from '@/utility/date';
import { formatStringForXml } from '@/utility/string';

export const FEED_PHOTO_REQUEST_LIMIT = 40;

export const FEED_PHOTO_WIDTH_SMALL = 200;
export const FEED_PHOTO_WIDTH_MEDIUM = 640;
export const FEED_PHOTO_WIDTH_LARGE = 1200;

interface FeedMedia {
  url: string
  width: number
  height: number
}

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

interface FeedPhotoRss {
  id: string
  title: string
  description?: string
  link: string
  pubDate: Date
  media: Record<'content' | 'thumb', FeedMedia>
}

export interface FeedJson {
  meta: {
    title: string
    url: string
  }
  photos: FeedPhotoJson[]
}

const generateFeedMedia = (
  photo: Photo,
  size: NextImageSize,
): FeedMedia => ({
  url: getNextImageUrlForRequest({ imageUrl: photo.url, size }),
  width: size,
  height: Math.round(size / photo.aspectRatio),
});

const getCoreFeedFields = (photo: Photo) => ({
  id: photo.id,
  title: titleForPhoto(photo),
  description: descriptionForPhoto(photo, true),
});

export const formatPhotoForFeedJson = (photo: Photo): FeedPhotoJson => ({
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

const formatPhotoForFeedRss = (photo: Photo): FeedPhotoRss => ({
  ...getCoreFeedFields(photo),
  link: absolutePathForPhoto({ photo }),
  pubDate: photo.createdAt,
  media: {
    content: generateFeedMedia(photo, FEED_PHOTO_WIDTH_LARGE),
    thumb: generateFeedMedia(photo, FEED_PHOTO_WIDTH_MEDIUM),
  },
});

const feedPhotoToXml = (photo: FeedPhotoRss): string => {
  const formattedDate = formatDate({ date: photo.pubDate, length: 'rss' });
  return `<item>
    <title>${photo.title}</title>
    <link>${photo.link}</link>
    <pubDate>${formattedDate}</pubDate>
    <guid isPermaLink="true">${photo.link}</guid>
    ${photo.description
    ? `<description><![CDATA[${photo.description}]]></description>`
    : ''}
    <media:content
      url="${formatStringForXml(photo.media.content.url)}"
      type="image/jpeg"
      medium="image"
      width="${photo.media.content.width}"
      height="${photo.media.content.height}"
    >
      <media:thumbnail
        url="${formatStringForXml(photo.media.thumb.url)}"
        width="${photo.media.thumb.width}"
        height="${photo.media.thumb.height}"
      />
    </media:content>
  </item>`;
};

export const createRssItems = (photos: Photo[]) =>
  photos.map(formatPhotoForFeedRss).map(feedPhotoToXml);
