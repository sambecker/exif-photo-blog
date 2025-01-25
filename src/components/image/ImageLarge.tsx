import { IMAGE_WIDTH_LARGE, ImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';
import ImageActions from './ImageActions';

export default function ImageLarge(props: ImageProps) {
  const {
    aspectRatio,
    blurCompatibilityMode,
    enableImageActions = false,
    ...rest
  } = props;
  return (
    <ImageActions
      enableImageActions={enableImageActions}
      className="flex relative items-center justify-center h-full"
    >
      <ImageWithFallback {...{
        ...rest,
        blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
        width: IMAGE_WIDTH_LARGE,
        height: Math.round(IMAGE_WIDTH_LARGE / aspectRatio),
      }} />
    </ImageActions>
  );
};
