/**
 * @jest-environment node
 */
import imageLoader, {
  getOptimizedVariantUrl,
  originalImageLoader,
} from '@/utility/image-loader';

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

  it('caps widths above the largest variant at -lg', () => {
    expect(imageLoader({ src: ORIGINAL, width: 1200 }))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-lg.jpg`);
    expect(imageLoader({ src: ORIGINAL, width: 2048 }))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-lg.jpg`);
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

describe('getOptimizedVariantUrl', () => {
  it('returns the variant URL for photo sources', () => {
    expect(getOptimizedVariantUrl(ORIGINAL, 300))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-md.jpg`);
    expect(getOptimizedVariantUrl(ORIGINAL, 2048))
      .toBe(`${ORIGINAL.replace('.jpg', '')}-lg.jpg`);
  });

  it('returns undefined for non-photo and data sources', () => {
    expect(getOptimizedVariantUrl('data:image/svg+xml,abc', 640))
      .toBeUndefined();
    expect(
      getOptimizedVariantUrl('https://api.qrserver.com/v1/x', 640),
    ).toBeUndefined();
  });
});
