import { IMAGE_QUALITY } from '@/app/config';
import { IMAGE_WIDTH_LARGE, CustomImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageLarge(props: CustomImageProps) {
  const {
    aspectRatio = 1,
    blurCompatibilityMode,
    ...rest
  } = props;
  const safeAspectRatio = aspectRatio > 0 ? aspectRatio : 1;
  return (
    <ImageWithFallback {...{
      ...rest,
      blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
      width: IMAGE_WIDTH_LARGE,
      height: Math.round(IMAGE_WIDTH_LARGE / safeAspectRatio),
      quality: IMAGE_QUALITY,
    }} />
  );
};
