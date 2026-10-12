import { getPhotoCached } from '@/photo/cache';
import { getAlbumFromSlugCached } from '@/album/cache';
import { safelyParseFormattedHtmlNodes } from '@/utility/html';
import { MentionContent, getMentionIdsFromNodes } from '.';

const fetchByKeys = async <T>(
  keys: Set<string>,
  fetch: (key: string) => Promise<T | undefined>,
): Promise<Record<string, T>> =>
  Promise.all(Array.from(keys).map(key => fetch(key)
    .catch(() => undefined)
    .then(value => [key, value] as const)))
    .then(entries => Object.fromEntries(entries
      .filter((entry): entry is readonly [string, Awaited<T>] =>
        entry[1] !== undefined)));

// Hidden photos and missing albums render as plain text
export const getMentionContent = async (
  text: string,
): Promise<MentionContent> => {
  const nodes = safelyParseFormattedHtmlNodes(text);
  const ids = getMentionIdsFromNodes(nodes);
  const [photos, albums] = await Promise.all([
    fetchByKeys(ids.photo, id => getPhotoCached(id)),
    fetchByKeys(ids.album, slug => getAlbumFromSlugCached(slug)),
  ]);
  return { nodes, photos, albums };
};
