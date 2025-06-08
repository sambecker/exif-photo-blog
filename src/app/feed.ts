import { Photo } from '@/photo';
import { absolutePathForPhoto } from './paths';
import { getNextImageUrlForRequest } from '@/platforms/next-image';
import { formatDate } from '@/utility/date';

export const FEED_PHOTO_WIDTH_CONTENT = 1080;
export const FEED_PHOTO_WIDTH_THUMB = 640;

export interface PublicFeed {
  meta: {
    title: string
    url: string
  }
  photos: PublicFeedPhoto[]
}

interface PublicFeedMedia {
  url: string
  width: number
  height: number
}

interface PublicFeedPhoto {
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

export const formatPhotoForFeed = (photo: Photo): PublicFeedPhoto => ({
  id: photo.id,
  title: photo.title,
  description: photo.caption,
  link: absolutePathForPhoto({ photo }),
  publicationDate: photo.createdAt,
  media: {
    content: {
      url: getNextImageUrlForRequest({
        imageUrl: photo.url,
        size: FEED_PHOTO_WIDTH_CONTENT,
      }),
      width: FEED_PHOTO_WIDTH_CONTENT,
      height: Math.round(FEED_PHOTO_WIDTH_CONTENT / photo.aspectRatio),
    },
    thumb: {
      url: getNextImageUrlForRequest({
        imageUrl: photo.url,
        size: FEED_PHOTO_WIDTH_THUMB,
      }),
      width: FEED_PHOTO_WIDTH_THUMB,
      height: Math.round(FEED_PHOTO_WIDTH_THUMB / photo.aspectRatio),
    },
  },
});

export const feedPhotoToXml = (photo: PublicFeedPhoto): string => {
  const formattedDate = formatDate({
    date: photo.publicationDate,
    length: 'rss',
  });
  const description = photo.description ?
    `<description>
      <![CDATA[${photo.description}]]>
    </description>` : '';

  return `  <item>
        <title>${photo.title}</title>
        <link>${photo.link}</link>
        <pubDate>${formattedDate}</pubDate>
        <guid isPermaLink="true">${photo.link}</guid>
        ${description}
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
