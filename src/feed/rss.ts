import { Photo } from '@/photo';
import {
  FEED_PHOTO_WIDTH_LARGE,
  FEED_PHOTO_WIDTH_MEDIUM,
  FeedMedia,
  generateFeedMedia,
  getCoreFeedFields,
} from './programmatic';
import { ABSOLUTE_PATH_RSS_XML, absolutePathForPhoto } from '@/app/path';
import { formatDate } from '@/utility/date';
import { formatStringForXml } from '@/utility/string';
import { BASE_URL, META_DESCRIPTION, META_TITLE } from '@/app/config';

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
  return `<item>
    <title>${photo.title}</title>
    <link>${photo.link}</link>
    <pubDate>
      ${formatDate({ date: photo.pubDate, length: 'rss' })}
    </pubDate>
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

export const formatFeedRssXml = (photos: Photo[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>
   <rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:media="http://search.yahoo.com/mrss/"
   >
    <channel>
      <title>${META_TITLE}</title>
      <atom:link
        href="${ABSOLUTE_PATH_RSS_XML}"
        rel="self"
        type="application/rss+xml"
      />
      <link>${BASE_URL}</link>
      <description>${META_DESCRIPTION}</description>
      ${photos.map(formatPhotoForFeedRss).map(feedPhotoToXml).join('\n')}
    </channel>
  </rss>`;
