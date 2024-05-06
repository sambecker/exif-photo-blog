import { IMAGE_TINY_WIDTH } from '@/site';
import ImageBlurFallback from './ImageBlurFallback';

export default function ImageTiny({
  className,
  src,
  alt,
  aspectRatio,
  blurData,
  blurCompatibilityMode,
}: {
  className?: string
  src: string
  alt: string
  aspectRatio: number
  blurData?: string
  blurCompatibilityMode?: boolean
}) {
  return (
    <ImageBlurFallback {...{
      className,
      src,
      alt,
      blurDataURL: blurData,
      blurCompatibilityMode,
      width: IMAGE_TINY_WIDTH,
      height: Math.round(IMAGE_TINY_WIDTH / aspectRatio),
    }} />
  );
};
