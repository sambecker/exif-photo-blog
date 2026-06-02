import { IMAGE_QUALITY } from '@/app/config';
import { IMAGE_WIDTH_LARGE, CustomImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageLarge(props: CustomImageProps) {
  const {
    aspectRatio,
    blurCompatibilityMode,
    ...rest
  } = props;
  return (
    <ImageWithFallback {...{
      ...rest,
      blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
      width: IMAGE_WIDTH_LARGE,
      height: Math.round(IMAGE_WIDTH_LARGE / aspectRatio),
      quality: IMAGE_QUALITY,
      // Detail view: capped at IMAGE_WIDTH_LARGE on desktop, full viewport on mobile
      sizes: '(min-width: 1024px) 1000px, 100vw',
    }} />
  );
};
