import sanitizeHtml from 'sanitize-html';

const ALLOWED_FORMATTING_TAGS = ['b', 'strong', 'i', 'em', 'u', 'br', 'a'];

export const safelyParseFormattedHtml = (text: string) =>
  sanitizeHtml(text, {
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

// Matches two or more <br> or <br /> tags in a row
export const htmlHasBrParagraphBreaks = (text: string) =>
  /(<br\s*\/?>){2}/i.test(text);
