import { IMAGE_WIDTH_SMALL, CustomImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageSmall(props: CustomImageProps) {
  const {
    aspectRatio,
    blurCompatibilityMode,
    ...rest
  } = props;
  return (
    <ImageWithFallback {...{
      ...rest,
      blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
      width: IMAGE_WIDTH_SMALL,
      height: Math.round(IMAGE_WIDTH_SMALL / aspectRatio),
    }} />
  );
};
