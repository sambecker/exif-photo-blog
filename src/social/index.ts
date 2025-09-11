import { AppTextState } from '@/i18n/state';
import { parseCommaSeparatedKeyString } from '@/utility/key';

export const SOCIAL_KEYS = [
  'x',
  'threads',
  'facebook',
  'linkedin',
] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

export const DEFAULT_SOCIAL_KEYS: SocialKey[] = [
  'x',
];

export const parseSocialKeysFromString = (string?: string) =>
  parseCommaSeparatedKeyString({
    string,
    acceptedKeys: SOCIAL_KEYS,
    defaultKeys: DEFAULT_SOCIAL_KEYS,
  });

export const urlForSocial = (
  key: SocialKey,
  path: string,
  text: string,
) => {
  switch (key) {
    case 'x': {
      const url = new URL('https://x.com/intent/tweet');
      url.searchParams.set('url', path);
      url.searchParams.set('text', text);
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
      url.searchParams.set('text', text);
      return url.toString();
    }
  }
};

export const tooltipForSocial = (
  key: SocialKey,
  { tooltip }: AppTextState,
) => {
  switch (key) {
    case 'x': return tooltip.shareX;
    case 'threads': return tooltip.shareThreads;
    case 'facebook': return tooltip.shareFacebook;
    case 'linkedin': return tooltip.shareLinkedIn;
  }
};
