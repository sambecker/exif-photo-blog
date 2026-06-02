import { IMAGE_QUALITY } from '@/app/config';
import { IMAGE_WIDTH_MEDIUM, CustomImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageMedium(props: CustomImageProps) {
  const {
    aspectRatio,
    blurCompatibilityMode,
    ...rest
  } = props;

  return (
    <ImageWithFallback {...{
      ...rest,
      blurCompatibilityLevel: blurCompatibilityMode ? 'low' : 'none',
      width: IMAGE_WIDTH_MEDIUM,
      height: Math.round(IMAGE_WIDTH_MEDIUM / aspectRatio),
      // Slightly lower quality for grid thumbnails — visually identical at this size
      quality: Math.min(IMAGE_QUALITY, 55),
      // Grid: 2 cols on mobile, 3-4 on tablet, 4-6 on desktop
      sizes:
        '(min-width: 1024px) 25vw, ' +
        '(min-width: 768px) 33vw, ' +
        '(min-width: 640px) 25vw, ' +
        '50vw',
    }} />
  );
};
