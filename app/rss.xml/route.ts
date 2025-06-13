import { getPhotosCached } from '@/photo/cache';
import {
  BASE_URL,
  META_DESCRIPTION,
  META_TITLE,
  SITE_FEEDS_ENABLED,
} from '@/app/config';
import { createRssItems, FEED_PHOTO_REQUEST_LIMIT } from '@/app/feed';
import { ABSOLUTE_PATH_FOR_RSS_XML } from '@/app/paths';

// Cache for 24 hours
export const revalidate = 86_400;

export async function GET() {
  if (SITE_FEEDS_ENABLED) {
    const photos = await getPhotosCached({
      limit: FEED_PHOTO_REQUEST_LIMIT,
      sortBy: 'createdAt',
    });

    const items = createRssItems(photos);

    return new Response(`<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:atom="http://www.w3.org/2005/Atom"
        xmlns:media="http://search.yahoo.com/mrss/"
      >
        <channel>
          <title>${META_TITLE}</title>
          <atom:link
            href="${ABSOLUTE_PATH_FOR_RSS_XML}"
            rel="self"
            type="application/rss+xml"
          />
          <link>${BASE_URL}</link>
          <description>${META_DESCRIPTION}</description>
          ${items.join('\n')}
        </channel>
      </rss>
    `,
    { headers: { 'Content-Type': 'text/xml' } },
    );
  } else {
    return new Response('Feed disabled', { status: 404 });
  }
}
