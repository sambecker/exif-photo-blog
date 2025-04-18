import { cache } from 'react';
import { INFINITE_SCROLL_FEED_INITIAL } from '@/photo';
import { getPhotos } from '@/photo/db/query';
import { getNextImageUrlForRequest } from '@/platforms/next-image';
import {
  BASE_URL,
  META_DESCRIPTION,
  META_TITLE,
} from '@/app/config';
import { absolutePathForPhoto } from '@/app/paths';
import { formatDate } from '@/utility/date';

export const dynamic = 'force-static';

const getPhotosCached = cache(() => getPhotos({
  limit: INFINITE_SCROLL_FEED_INITIAL,
}));

export async function GET() {
  const photos = await getPhotosCached().catch(() => []);

  const items = [];
  for (const photo of photos) {
    const link = absolutePathForPhoto({photo: photo});
    const imageWidth = 1080;
    const imageHeight = Math.round(imageWidth / photo.aspectRatio);
    const image = getNextImageUrlForRequest(
      { imageUrl: photo.url, size: imageWidth })
      .replaceAll('&', '&amp;');
    const thumbWidth = 640;
    const thumbHeight = Math.round(thumbWidth / photo.aspectRatio);
    const thumb = getNextImageUrlForRequest(
      { imageUrl: photo.url, size: thumbWidth })
      .replaceAll('&', '&amp;');

    const description = photo.caption ?
      `<description>
        <![CDATA[${photo.caption}]]>
      </description>` : '';

    items.push(`<item>
      <title>${photo.title}</title>
      <link>${link}</link>
      <pubDate>${formatDate({date: photo.createdAt, length: 'rss'})}</pubDate>
      <guid isPermaLink="true">${link}</guid>
      ${description}
      <media:content url="${image}" type="image/jpeg"
        medium="image" width="${imageWidth}" height="${imageHeight}">
        <media:thumbnail url="${thumb}"
          width="${thumbWidth}" height="${thumbHeight}" />
      </media:content>
    </item>`);
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">

  <channel>
    <title>${META_TITLE}</title>
    <atom:link href="${BASE_URL}/rss.xml"
      rel="self" type="application/rss+xml" />
    <link>${BASE_URL}</link>
    <description>${META_DESCRIPTION}</description>

    ${items.join('\n\n    ')}

  </channel>

</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    },
  );
}
