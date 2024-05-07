import { IMAGE_SMALL_WIDTH } from '@/site';
import ImageBlurFallback from './ImageBlurFallback';

export default function ImageSmall({
  className,
  src,
  alt,
  aspectRatio,
  blurData,
  blurCompatibilityMode,
  priority,
}: {
  className?: string
  src: string
  alt: string
  aspectRatio: number
  blurData?: string
  blurCompatibilityMode?: boolean
  priority?: boolean
}) {
  return (
    <ImageBlurFallback {...{
      className,
      src,
      alt,
      blurDataURL: blurData,
      blurCompatibilityLevel: blurCompatibilityMode ? 'high' : 'none',
      priority,
      width: IMAGE_SMALL_WIDTH,
      height: Math.round(IMAGE_SMALL_WIDTH / aspectRatio),
    }} />
  );
};
