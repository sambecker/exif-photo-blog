import sanitizeHtml from 'sanitize-html';
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
const transformMention = (type: MentionType): sanitizeHtml.Transformer =>
  (_tagName, attribs): sanitizeHtml.Tag => {
    const id = parseMentionId(attribs.id);
    return id
      ? { tagName: 'a', attribs: { href: pathForMention({ type, id }) } }
      : { tagName: 'span', attribs: {} };
  };

export const safelyParseFormattedHtml = (text: string) =>
  sanitizeHtml(replaceNewlinesWithBr(text), {
    allowedTags: ALLOWED_FORMATTING_TAGS,
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
        [type, transformMention(type)])),
    },
  });

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
