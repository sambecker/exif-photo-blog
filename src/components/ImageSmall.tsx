import { IMAGE_SMALL_WIDTH } from '@/site';
import ImageWithFallback from './ImageWithFallback';

export default function ImageSmall({
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
      width: IMAGE_SMALL_WIDTH,
      height: Math.round(IMAGE_SMALL_WIDTH / aspectRatio),
    }} />
  );
};
