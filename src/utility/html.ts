import sanitizeHtml from 'sanitize-html';

const ALLOWED_FORMATTING_TAGS = ['b', 'strong', 'i', 'em', 'u', 'br'];

export const safelyParseFormattedHtml = (text: string) =>
  sanitizeHtml(text, {
    allowedTags: ALLOWED_FORMATTING_TAGS,
  });

// Matches two or more <br> or <br /> tags in a row
export const htmlHasBrParagraphBreaks = (text: string) =>
  text.match(/(<br\s*\/?>){2}/i);
