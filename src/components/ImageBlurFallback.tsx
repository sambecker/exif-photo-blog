import { BLUR_ENABLED } from '@/site/config';
import clsx from 'clsx/lite';
import Image, { ImageProps } from 'next/image';

export default function ImageBlurFallback(props: ImageProps) {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image {...{
      ...props,
      ...BLUR_ENABLED && props.blurDataURL ? {
        placeholder: 'blur',
        blurDataURL: props.blurDataURL,
      }: {
        placeholder: 'empty',
        className: clsx(
          props.className,
          'bg-gray-100/50 dark:bg-gray-900/50',
        ),
      },
    }} />
  );
}
