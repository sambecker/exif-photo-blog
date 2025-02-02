import { GRID_IMAGE_SIZES, IMAGE_WIDTH_MEDIUM, ImageProps } from '.';
import ImageWithFallback from './ImageWithFallback';

export default function ImageMedium(props: ImageProps) {
  const {
    aspectRatio,
    blurCompatibilityMode,
    sizes = `
      (max-width: 640px) ${GRID_IMAGE_SIZES.sm}px,
      (max-width: 1024px) ${GRID_IMAGE_SIZES.md}px,
      ${GRID_IMAGE_SIZES.lg}px
    `,
    ...rest
  } = props;

  return (
    <ImageWithFallback {...{
      ...rest,
      blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
      width: IMAGE_WIDTH_MEDIUM,
      height: Math.round(IMAGE_WIDTH_MEDIUM / aspectRatio),
      sizes,
      quality: 80, // Slightly reduced quality for grid thumbnails
    }} />
  );
};
