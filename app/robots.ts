import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/app/config';
import {
  PATH_ADMIN,
  PATH_API,
  PATH_OG,
  PATH_SITEMAP,
  PATH_TEMPLATE_IMAGE,
} from '@/app/path';

// AI training/answer crawlers, which repeatedly fetch every photo,
// category page, and generated image
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'FacebookBot',
  'cohere-ai',
  'Diffbot',
  'Omgilibot',
  'ImagesiftBot',
  'Timpibot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: AI_CRAWLERS,
        disallow: '/',
      },
      // Generated OG images (/*/image, /home-image) stay crawlable
      // so link previews work on every platform
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          PATH_ADMIN,
          PATH_API,
          PATH_OG,
          // Prefix also matches /template-image-tight
          PATH_TEMPLATE_IMAGE,
        ],
      },
    ],
    sitemap: `${BASE_URL}${PATH_SITEMAP}`,
  };
}
