import { parseCommaSeparatedStringList } from '@/utility/env';

export const SHARE_KEYS = [
  'x',
  'threads',
  'facebook',
  'linkedin',
] as const;

export type ShareKey = (typeof SHARE_KEYS)[number];

export const DEFAULT_SHARE_KEYS: ShareKey[] = [
  'x',
];

export const parseSocialKeysFromString = (string?: string) =>
  parseCommaSeparatedStringList({
    string,
    acceptedKeys: SHARE_KEYS,
    defaultKeys: DEFAULT_SHARE_KEYS,
  });

export const generateXPostText = (path: string, text: string) => {
  const url = new URL('https://x.com/intent/tweet');
  url.searchParams.set('url', path);
  url.searchParams.set('text', text);
  return url.toString();
};
