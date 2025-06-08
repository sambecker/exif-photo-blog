import { INFINITE_SCROLL_FEED_INITIAL } from '@/photo';
import { getPhotosCached } from '@/photo/cache';
import {
  BASE_URL,
  META_DESCRIPTION,
  META_TITLE,
  PUBLIC_FEED_ENABLED,
} from '@/app/config';
import { feedPhotoToXml, formatPhotoForFeed } from '@/app/feed';

export const dynamic = 'force-static';

export async function GET() {
  if (PUBLIC_FEED_ENABLED) {
    const photos = await getPhotosCached({
      limit: INFINITE_SCROLL_FEED_INITIAL,
      sortBy: 'createdAt',
    });
    const items = photos.map(formatPhotoForFeed).map(feedPhotoToXml);

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
  } else {
    return new Response('RSS feed access disabled', { status: 404 });
  }
}
