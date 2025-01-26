import { IMAGE_WIDTH_LARGE, ImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageLarge(props: ImageProps) {
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
    }} />
  );
};
