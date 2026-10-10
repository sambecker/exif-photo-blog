import { markupForMention, parseMentionId } from '@/mention';
import { safelyParseFormattedHtml } from '@/utility/html';
import {
  populateElementWithMarkup,
  serializeElementToMarkup,
} from '@/components/rich-text/markup';

jest.mock('../src/platforms/redis', () => ({
  normalizeRedisUrl: (url?: string) => url,
}));

const MARKUP = [
  'Shot on <b>film</b> & digital,',
  'see <photo id="abc123">Sunset</photo>,',
  '<album id="summer-trip">Summer Trip</album>,',
  'and <tag id="landscape">Landscape</tag>.',
  '<a href="https://example.com">Elsewhere</a>',
].join('\n');

describe('Mention', () => {
  it('parses ids', () => {
    expect(parseMentionId('abc')).toBe('abc');
    expect(parseMentionId('{abc}')).toBe('abc');
    expect(parseMentionId(' { abc } ')).toBe('abc');
    expect(parseMentionId('')).toBeUndefined();
    expect(parseMentionId(undefined)).toBeUndefined();
  });

  it('generates escaped markup', () => {
    expect(markupForMention({
      type: 'tag',
      id: 'a"b',
      title: '<Tag> & more',
    })).toBe('<tag id="a&quot;b">&lt;Tag&gt; &amp; more</tag>');
  });

  it('renders mentions as relative links', () => {
    const html = safelyParseFormattedHtml(MARKUP);
    expect(html).toContain('<a href="/p/abc123">Sunset</a>');
    expect(html).toContain('<a href="/album/summer-trip">Summer Trip</a>');
    expect(html).toContain('<a href="/tag/landscape">Landscape</a>');
    expect(html)
      .toContain('<a href="https://example.com" target="_blank">Elsewhere</a>');
    expect(html).not.toContain('<photo');
  });

  it('renders JSX-style ids', () => {
    expect(safelyParseFormattedHtml('<photo id={abc}>Sunset</photo>'))
      .toBe('<a href="/p/abc">Sunset</a>');
  });

  it('renders mentions without ids as plain text', () => {
    expect(safelyParseFormattedHtml('<photo>Sunset</photo>')).toBe('Sunset');
  });

  it('round trips through the editor', () => {
    const element = document.createElement('div');
    populateElementWithMarkup(element, MARKUP);
    expect(element.querySelectorAll('[data-mention-type]').length).toBe(3);
    expect(element.querySelector('[data-mention-type="photo"]')
      ?.getAttribute('contenteditable')).toBe('false');
    expect(serializeElementToMarkup(element))
      .toBe(MARKUP.replace('&', '&amp;'));
  });

  it('strips disallowed markup in the editor', () => {
    const element = document.createElement('div');
    populateElementWithMarkup(element, [
      '<script>alert(1)</script>',
      '<img src=x onerror="alert(1)">',
      'Hi <span>there</span>',
    ].join(''));
    expect(element.querySelector('script, img, span')).toBeNull();
    expect(serializeElementToMarkup(element)).toBe('Hi there');
  });

  it('serializes browser line breaks', () => {
    const element = document.createElement('div');
    element.innerHTML = 'One<div>Two</div><div><br></div><div>Three</div><br>';
    expect(serializeElementToMarkup(element)).toBe('One\nTwo\n\nThree');
  });
});
