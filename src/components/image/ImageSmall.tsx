import { IMAGE_WIDTH_SMALL, CustomImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageSmall(props: CustomImageProps) {
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
      width: IMAGE_WIDTH_SMALL,
      height: Math.round(IMAGE_WIDTH_SMALL / safeAspectRatio),
    }} />
  );
};
