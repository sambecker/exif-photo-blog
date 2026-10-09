import {
  htmlHasBrParagraphBreaks,
  htmlToPlainText,
  safelyParseFormattedHtml,
} from '@/utility/html';

describe('HTML', () => {
  it('safely parses', () => {
    expect(safelyParseFormattedHtml('<p>TEXT</p>')).toBe('TEXT');
    expect(safelyParseFormattedHtml('<b>TEXT</b>')).toBe('<b>TEXT</b>');
    expect(safelyParseFormattedHtml('Line 1\nLine 2'))
      .toBe('Line 1<br />Line 2');
    expect(safelyParseFormattedHtml('Line 1\r\n\r\nLine 2'))
      .toBe('Line 1<br /><br />Line 2');
    expect(safelyParseFormattedHtml('<b>Bold</b>\ntext'))
      .toBe('<b>Bold</b><br />text');
  });
  it('converts html to plain text', () => {
    expect(htmlToPlainText('<b>Bold</b> and <i>italic</i>'))
      .toBe('Bold and italic');
    expect(htmlToPlainText('Line 1<br>Line 2')).toBe('Line 1 Line 2');
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
