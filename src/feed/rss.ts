import { Photo } from '@/photo';
import {
  FEED_PHOTO_WIDTH_LARGE,
  FEED_PHOTO_WIDTH_MEDIUM,
  FeedMedia,
  generateFeedMedia,
  getCoreFeedFields,
} from '.';
import { absolutePathForPhoto } from '@/app/paths';
import { formatDate } from '@/utility/date';
import { formatStringForXml } from '@/utility/string';

interface FeedPhotoRss {
  id: string
  title: string
  description?: string
  link: string
  pubDate: Date
  media: Record<'content' | 'thumb', FeedMedia>
}

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
