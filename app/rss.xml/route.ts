import { INFINITE_SCROLL_FEED_INITIAL } from '@/photo';
import { getPhotosCached } from '@/photo/cache';
import {
  BASE_URL,
  META_DESCRIPTION,
  META_TITLE,
  SITE_FEEDS_ENABLED,
} from '@/app/config';
import { feedPhotoToXml, formatPhotoForFeedRss } from '@/app/feed';
import { ABSOLUTE_PATH_FOR_FEED_JSON } from '@/app/paths';

export const dynamic = 'force-static';

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotosCached({
      limit: INFINITE_SCROLL_FEED_INITIAL,
      sortBy: 'createdAt',
    });
    const items = photos.map(formatPhotoForFeedRss).map(feedPhotoToXml);

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:media="http://search.yahoo.com/mrss/">

    <channel>
      <title>${META_TITLE}</title>
      <atom:link href="${ABSOLUTE_PATH_FOR_FEED_JSON}"
        rel="self" type="application/rss+xml" />
      <link>${BASE_URL}</link>
      <description>${META_DESCRIPTION}</description>
      ${items.join('\n')}
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
