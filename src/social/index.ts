import { parseCommaSeparatedStringList } from '@/utility/env';

export const SOCIAL_KEYS = [
  'x',
  'threads',
  'facebook',
  'linkedin',
] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

const DEFAULT_SOCIAL_KEYS: SocialKey[] = [
  'x',
];

export const parseSocialKeysFromString = (string?: string) =>
  parseCommaSeparatedStringList({
    string,
    acceptedKeys: SOCIAL_KEYS,
    defaultKeys: DEFAULT_SOCIAL_KEYS,
  });

export const generateSocialUrl = (
  key: SocialKey,
  path: string,
  text: string,
) => {
  switch (key) {
    case 'x': {
      const url = new URL('https://x.com/intent/tweet');
      url.searchParams.set('url', path);
      if (text) { url.searchParams.set('text', text); }
      return url.toString();
    }
    case 'threads': {
      const url = new URL('https://www.threads.net/intent/post');
      url.searchParams.set('text', `${text} ${path}`);
      return url.toString();
    }
    case 'facebook': {
      const url = new URL('https://www.facebook.com/sharer/sharer.php');
      url.searchParams.set('u', path);
      return url.toString();
    }
    case 'linkedin': {
      const url = new URL('https://www.linkedin.com/shareArticle');
      url.searchParams.set('url', path);
      if (text) { url.searchParams.set('text', text); }
      return url.toString();
    }
  }
};

export const tooltipForSocialKey = (key: SocialKey) => {
  switch (key) {
    case 'x': return 'Share on X';
    case 'threads': return 'Share on Threads';
    case 'facebook': return 'Share on Facebook';
    case 'linkedin': return 'Share on LinkedIn';
  }
};
