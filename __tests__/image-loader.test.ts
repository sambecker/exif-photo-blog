/**
 * @jest-environment node
 */
import imageLoader, { originalImageLoader } from '@/utility/image-loader';

const ORIGINAL =
  'https://bucket.s3.sa-east-1.amazonaws.com/photo-rFgmziSu3D4Qh6qT.jpg';

describe('imageLoader', () => {
  it('maps widths to the smallest pre-generated variant', () => {
    expect(imageLoader({ src: ORIGINAL, width: 50 }))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-sm.jpg`);
    expect(imageLoader({ src: ORIGINAL, width: 200 }))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-sm.jpg`);
    expect(imageLoader({ src: ORIGINAL, width: 300 }))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-md.jpg`);
    expect(imageLoader({ src: ORIGINAL, width: 640 }))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-md.jpg`);
    expect(imageLoader({ src: ORIGINAL, width: 1080 }))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-lg.jpg`);
  });

  it('falls back to the default optimizer for widths above the largest variant',
    () => {
      const url = imageLoader({ src: ORIGINAL, width: 1200 });
      expect(url).toContain('/_next/image?url=');
      expect(url).toContain('w=1200');
    });

  it('leaves non-photo sources to the default optimizer', () => {
    const qr =
      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=x';
    expect(imageLoader({ src: qr, width: 640 })).toContain('/_next/image?url=');
  });

  it('passes through data URLs and already-optimized sources untouched', () => {
    expect(imageLoader({ src: 'data:image/svg+xml,abc', width: 640 }))
      .toBe('data:image/svg+xml,abc');
    const optimized = ORIGINAL.replace('.jpg', '-md.jpg');
    expect(imageLoader({ src: optimized, width: 640 })).toBe(optimized);
  });

  it('reproduces the default optimizer URL as the fallback loader', () => {
    expect(originalImageLoader({ src: ORIGINAL, width: 640, quality: 75 }))
      .toBe(`/_next/image?url=${encodeURIComponent(ORIGINAL)}&w=640&q=75`);
  });
});
