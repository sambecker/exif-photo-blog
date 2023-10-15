import { makeUrlAbsolute, shortenUrl } from '@/utility/url';
import '@testing-library/jest-dom';

const URL_LONG_1  = 'https://www.example.com/';
const URL_LONG_2  = 'https://www.example.com';
const URL_LONG_3  = 'https://example.com/';
const URL_LONG_4  = 'http://example.com/';
const URL_LONG_5  = 'https://example.com';
const URL_LONG_6  = 'https://example.com/final-path';
const URL_LONG_7  = 'https://example.com/final-path/';

const URL_SHORT_1 = 'example.com';
const URL_SHORT_2 = 'example.com/';
const URL_SHORT_3 = 'example.com/final-path';

describe('String', () => {
  it('url can be shortened', () => {
    expect(shortenUrl(URL_LONG_1)).toBe(URL_SHORT_1);
    expect(shortenUrl(URL_LONG_2)).toBe(URL_SHORT_1);
    expect(shortenUrl(URL_LONG_3)).toBe(URL_SHORT_1);
    expect(shortenUrl(URL_LONG_4)).toBe(URL_SHORT_1);
    expect(shortenUrl(URL_SHORT_1)).toBe(URL_SHORT_1);
    expect(shortenUrl(URL_LONG_6)).toBe(URL_SHORT_3);
    expect(shortenUrl(URL_LONG_7)).toBe(URL_SHORT_3);
  });
  it('url can be made absolute', () => {
    expect(makeUrlAbsolute(URL_SHORT_1)).toBe(URL_LONG_5);
    expect(makeUrlAbsolute(URL_SHORT_2)).toBe(URL_LONG_5);
  });
});
