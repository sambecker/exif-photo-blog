import { pathForAlbum, pathForPhoto, pathForTag } from '@/app/path';
import type { Photo } from '@/photo';
import type { Album } from '@/album';
import type { FormattedHtmlNode } from '@/utility/html';

export const MENTION_TYPES = ['photo', 'album', 'tag'] as const;

export type MentionType = typeof MENTION_TYPES[number];

export interface Mention {
  type: MentionType
  id: string
  title: string
}

export const isMentionType = (type?: string | null): type is MentionType =>
  MENTION_TYPES.includes(type as MentionType);

// Accept both id="value" and JSX-style id={value}
export const parseMentionId = (id?: string | null) =>
  id?.trim().replace(/^\{(.*)\}$/, '$1').trim() || undefined;

export const pathForMention = ({
  type,
  id,
}: Pick<Mention, 'type' | 'id'>) => {
  switch (type) {
    case 'photo': return pathForPhoto({ photo: id });
    case 'album': return pathForAlbum(id);
    case 'tag': return pathForTag(id);
  }
};

export const escapeHtmlText = (text: string) => text
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

export const escapeHtmlAttribute = (text: string) =>
  escapeHtmlText(text).replaceAll('"', '&quot;');

// Sanitized nodes plus the entities they mention, keyed by mention id
export interface MentionContent {
  nodes: FormattedHtmlNode[]
  photos: Record<string, Photo>
  albums: Record<string, Album>
}

export const getMentionIdsFromNodes = (
  nodes: FormattedHtmlNode[],
  ids: Record<MentionType, Set<string>> = {
    photo: new Set(),
    album: new Set(),
    tag: new Set(),
  },
) => {
  nodes.forEach(node => {
    if (typeof node !== 'string') {
      if (isMentionType(node.tag) && node.attributes.id) {
        ids[node.tag].add(node.attributes.id);
      }
      getMentionIdsFromNodes(node.children, ids);
    }
  });
  return ids;
};

export const markupForMention = ({ type, id, title }: Mention) =>
  `<${type} id="${escapeHtmlAttribute(id)}">${escapeHtmlText(title)}</${type}>`;
