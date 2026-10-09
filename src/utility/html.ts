import sanitizeHtml from 'sanitize-html';

const ALLOWED_FORMATTING_TAGS = ['b', 'strong', 'i', 'em', 'u', 'br', 'a'];

const replaceNewlinesWithBr = (text: string) =>
  text.replace(/\r\n|\n|\r/g, '<br />');

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
