import { pathForAlbum, pathForPhoto, pathForTag } from '@/app/path';

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

export const markupForMention = ({ type, id, title }: Mention) =>
  `<${type} id="${escapeHtmlAttribute(id)}">${escapeHtmlText(title)}</${type}>`;
