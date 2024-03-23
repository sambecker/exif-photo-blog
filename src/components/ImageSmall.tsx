import { IMAGE_SMALL_WIDTH } from '@/site';
import ImageBlurFallback from './ImageBlurFallback';

export default function ImageSmall({
  className,
  src,
  alt,
  aspectRatio,
  blurData,
  priority,
}: {
  className?: string
  src: string
  alt: string
  aspectRatio: number
  blurData?: string
  priority?: boolean
}) {
  return (
    <ImageBlurFallback {...{
      className,
      src,
      alt,
      priority,
      blurDataURL: blurData,
      width: IMAGE_SMALL_WIDTH,
      height: Math.round(IMAGE_SMALL_WIDTH / aspectRatio),
    }} />
  );
};
