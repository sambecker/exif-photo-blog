import { TbPhotoShare } from 'react-icons/tb';
import PathLoaderButton from './primitives/PathLoaderButton';
import clsx from 'clsx';

export default function ShareButton({
  path,
  prefetch,
  shouldScroll,
  dim,
  className,
}: {
  path: string
  prefetch?: boolean
  shouldScroll?: boolean
  dim?: boolean
  className?: string
}) {
  return (
    <PathLoaderButton
      path={path}
      className={clsx(
        className,
        dim ? 'text-dim' : 'text-medium',
      )}
      icon={<TbPhotoShare size={17} />}
      spinnerColor="dim"
      prefetch={prefetch}
      shouldScroll={shouldScroll}
      shouldReplace
      styleAsLink
    />
  );
}
