import { IMAGE_LARGE_WIDTH } from '@/site';
import ImageBlurFallback from './ImageBlurFallback';

export default function ImageLarge({
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
      width: IMAGE_LARGE_WIDTH,
      height: Math.round(IMAGE_LARGE_WIDTH / aspectRatio),
    }} />
  );
};
