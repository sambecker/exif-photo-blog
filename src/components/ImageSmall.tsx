import { IMAGE_SMALL_WIDTH } from '@/site';
import ImageBlurFallback from './ImageBlurFallback';

export default function ImageSmall({
  className,
  src,
  alt,
  aspectRatio,
  blurData,
}: {
  className?: string
  src: string
  alt: string
  aspectRatio: number
  blurData?: string
}) {
  return (
    <ImageBlurFallback {...{
      className,
      src,
      alt,
      blurDataURL: blurData,
      width: IMAGE_SMALL_WIDTH,
      height: Math.round(IMAGE_SMALL_WIDTH / aspectRatio),
    }} />
  );
};
