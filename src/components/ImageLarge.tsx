import { IMAGE_LARGE_WIDTH } from '@/site';
import ImageWithFallback from './ImageWithFallback';

export default function ImageLarge({
  className,
  imgClassName,
  src,
  alt,
  aspectRatio,
  blurData,
  blurCompatibilityMode,
  priority,
}: {
  className?: string
  imgClassName?: string
  src: string
  alt: string
  aspectRatio: number
  blurData?: string
  blurCompatibilityMode?: boolean
  priority?: boolean
}) {
  return (
    <ImageWithFallback {...{
      className,
      imgClassName,
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
