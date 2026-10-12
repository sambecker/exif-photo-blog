import sanitizeHtml from 'sanitize-html';
import { ElementType, parseDocument } from 'htmlparser2';
import {
  MENTION_TYPES,
  MentionType,
  parseMentionId,
  pathForMention,
} from '@/mention';

const ALLOWED_FORMATTING_TAGS = ['b', 'strong', 'i', 'em', 'u', 'br', 'a'];

const replaceNewlinesWithBr = (text: string) =>
  text.replace(/\r\n|\n|\r/g, '<br />');

// Mentions without a valid id fall back to their plain text title
const transformMention = (
  type: MentionType,
  preserveMentions: boolean,
): sanitizeHtml.Transformer =>
  (_tagName, attribs): sanitizeHtml.Tag => {
    const id = parseMentionId(attribs.id);
    if (!id) {
      return { tagName: 'span', attribs: {} };
    } else if (preserveMentions) {
      return { tagName: type, attribs: { id } };
    } else {
      return { tagName: 'a', attribs: { href: pathForMention({ type, id }) } };
    }
  };

const sanitizeFormattedHtml = (text: string, preserveMentions: boolean) =>
  sanitizeHtml(replaceNewlinesWithBr(text), {
    allowedTags: preserveMentions
      ? [...ALLOWED_FORMATTING_TAGS, ...MENTION_TYPES]
      : ALLOWED_FORMATTING_TAGS,
    allowedAttributes: {
      a: ['href', 'target'],
      ...preserveMentions && Object.fromEntries(MENTION_TYPES.map(type =>
        [type, ['id']])),
    },
    allowedSchemes: ['https'],
    transformTags: {
      a: (tagName, attribs) => {
        return {
          tagName,
          attribs: {
            href: attribs.href,
            target: '_blank',
          },
        };
      },
      ...Object.fromEntries(MENTION_TYPES.map(type =>
        [type, transformMention(type, preserveMentions)])),
    },
  });

export const safelyParseFormattedHtml = (text: string) =>
  sanitizeFormattedHtml(text, false);

export type FormattedHtmlNode = string | {
  tag: string
  attributes: Record<string, string>
  children: FormattedHtmlNode[]
};

type DomNode = ReturnType<typeof parseDocument>['children'][number];

const convertDomNodes = (nodes: DomNode[]): FormattedHtmlNode[] =>
  nodes.flatMap((node): FormattedHtmlNode[] => node.type === ElementType.Text
    ? [node.data]
    : node.type === ElementType.Tag
      ? [{
        tag: node.name,
        attributes: node.attribs,
        children: convertDomNodes(node.children),
      }]
      : []);

// Sanitized formatting with mentions preserved for rendering as entities
export const safelyParseFormattedHtmlNodes = (text: string) =>
  convertDomNodes(parseDocument(sanitizeFormattedHtml(text, true)).children);

export const htmlToPlainText = (html: string) =>
  sanitizeHtml(html.replace(/<br\s*\/?>/gi, ' '), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, ' ')
    .trim();

// Matches two or more <br> or <br /> tags in a row
export const htmlHasBrParagraphBreaks = (text: string) =>
  /(<br\s*\/?>){2}/i.test(text);
