import { IMAGE_QUALITY } from '@/app/config';
import { IMAGE_WIDTH_LARGE, CustomImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

// Lets browsers choose smaller srcset candidates on narrow viewports
// instead of fixed 1x/2x widths
const IMAGE_SIZES_LARGE =
  `(max-width: ${IMAGE_WIDTH_LARGE}px) 100vw, ${IMAGE_WIDTH_LARGE}px`;

export default function ImageLarge(props: CustomImageProps) {
  const {
    aspectRatio,
    blurCompatibilityMode,
    sizes = IMAGE_SIZES_LARGE,
    ...rest
  } = props;
  return (
    <ImageWithFallback {...{
      ...rest,
      sizes,
      blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
      width: IMAGE_WIDTH_LARGE,
      height: Math.round(IMAGE_WIDTH_LARGE / aspectRatio),
      quality: IMAGE_QUALITY,
    }} />
  );
};
