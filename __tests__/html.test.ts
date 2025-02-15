import {
  htmlHasBrParagraphBreaks,
  safelyParseFormattedHtml,
} from '@/utility/html';

describe('HTML', () => {
  it('safely parses', () => {
    expect(safelyParseFormattedHtml('<p>TEXT</p>')).toBe('TEXT');
    expect(safelyParseFormattedHtml('<b>TEXT</b>')).toBe('<b>TEXT</b>');
  });
  it('detects br-style paragraph breaks', () => {
    expect(htmlHasBrParagraphBreaks('TEXT<br><br>')).toBeTruthy();
    expect(htmlHasBrParagraphBreaks('TEXT<br /><br />')).toBeTruthy();
    expect(htmlHasBrParagraphBreaks('TEXT<br><br />')).toBeTruthy();
    expect(htmlHasBrParagraphBreaks('TEXT')).toBeFalsy();
    expect(htmlHasBrParagraphBreaks('TEXT<br/>')).toBeFalsy();
    expect(htmlHasBrParagraphBreaks('TEXT<br />')).toBeFalsy();
  });
});
