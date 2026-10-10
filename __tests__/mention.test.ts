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
    expect(serializeElementToMarkup(element))
      .toBe(MARKUP.replace('&', '&amp;'));
  });

  it('shows full markup with editable titles', () => {
    const element = document.createElement('div');
    populateElementWithMarkup(element, '<photo id="abc123">Sunset</photo>');
    const mention = element.querySelector('[data-mention-type="photo"]')!;
    expect(mention.textContent).toBe('<photo id={abc123}>Sunset</photo>');
    expect(mention.firstElementChild?.getAttribute('contenteditable'))
      .toBe('false');
    expect(mention.lastElementChild?.getAttribute('contenteditable'))
      .toBe('false');
    expect(mention.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
  });

  it('preserves links when titles are overwritten', () => {
    const element = document.createElement('div');
    populateElementWithMarkup(element, '<photo id="abc123">Sunset</photo>');
    const mention = element.querySelector('[data-mention-type="photo"]')!;
    mention.childNodes[1].textContent = 'Golden <hour>';
    expect(serializeElementToMarkup(element))
      .toBe('<photo id="abc123">Golden &lt;hour&gt;</photo>');
  });

  it('unlinks mentions when a tag is deleted', () => {
    const element = document.createElement('div');
    populateElementWithMarkup(element, 'See <tag id="landscape">Hills</tag>');
    element.querySelector('[data-mention-type] > :last-child')?.remove();
    expect(serializeElementToMarkup(element)).toBe('See Hills');
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
