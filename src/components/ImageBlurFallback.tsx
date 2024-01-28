'use client';

import { BLUR_DISABLED } from '@/site/config';
import { useTheme } from 'next-themes';
import Image, { ImageProps } from 'next/image';

// Based on bg-gray-100/50 (#f9f9fa)
// eslint-disable-next-line max-len
const BLUR_DATA_LIGHT = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAC4jAAAuIwF4pT92AAAADElEQVQImWP4+fMXAAXbAu0I+kpzAAAAAElFTkSuQmCC';

// Based on bg-gray-900/50 (#090c14)
// eslint-disable-next-line max-len
const BLUR_DATA_DARK = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAC4jAAAuIwF4pT92AAAADElEQVQImWPg5BEBAABLACpEF6ULAAAAAElFTkSuQmCC';

export default function ImageBlurFallback(props: ImageProps) {
  const { resolvedTheme } = useTheme();
  const blueFallback = resolvedTheme === 'dark'
    ? BLUR_DATA_DARK
    : BLUR_DATA_LIGHT;
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image {...{
      ...props,
      blurDataURL: !BLUR_DISABLED && props.blurDataURL
        ? props.blurDataURL
        : blueFallback,
      placeholder: 'blur',
    }} />
  );
}
