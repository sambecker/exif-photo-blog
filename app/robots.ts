import type { MetadataRoute } from 'next';
import { BASE_URL, BLOCK_AI_CRAWLERS } from '@/app/config';
import {
  PATH_ADMIN,
  PATH_API,
  PATH_HOME_IMAGE,
  PATH_OG,
  PATH_SITEMAP,
  PATH_TEMPLATE_IMAGE,
} from '@/app/path';

// Crawlers that bulk-fetch content for model training
const AI_TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
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

// Crawlers that fetch pages for AI search results or on behalf of users
const AI_SEARCH_CRAWLERS = [
  'ChatGPT-User',
  'OAI-SearchBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
];

const DISALLOWED_PATHS = [
  PATH_ADMIN,
  PATH_API,
  PATH_OG,
  // Prefix also matches /template-image-tight
  PATH_TEMPLATE_IMAGE,
];

// Generated OG images remain open to other crawlers
// so link previews work on every platform
const GENERATED_IMAGE_PATHS = [
  '/*/image$',
  PATH_HOME_IMAGE,
];

const rulesForBlockAiCrawlers = (): MetadataRoute.Robots['rules'] => {
  switch (BLOCK_AI_CRAWLERS) {
    case 'all':
      return [{
        userAgent: [...AI_TRAINING_CRAWLERS, ...AI_SEARCH_CRAWLERS],
        disallow: '/',
      }, {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      }];
    case 'some':
      return [{
        userAgent: AI_TRAINING_CRAWLERS,
        disallow: '/',
      }, {
        // Crawlers only obey their most specific group,
        // so shared rules are repeated here
        userAgent: AI_SEARCH_CRAWLERS,
        allow: '/',
        disallow: [...DISALLOWED_PATHS, ...GENERATED_IMAGE_PATHS],
      }, {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      }];
    case 'none':
      return {
        userAgent: '*',
        allow: '/',
      };
  }
};

export default function robots(): MetadataRoute.Robots {
  return {
    rules: rulesForBlockAiCrawlers(),
    sitemap: `${BASE_URL}${PATH_SITEMAP}`,
  };
}
