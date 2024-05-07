import { IMAGE_LARGE_WIDTH } from '@/site';
import ImageBlurFallback from './ImageBlurFallback';

export default function ImageLarge({
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
      width: IMAGE_LARGE_WIDTH,
      height: Math.round(IMAGE_LARGE_WIDTH / aspectRatio),
    }} />
  );
};
