import { clsx } from 'clsx/lite';
import { IconBaseProps } from 'react-icons';
import { FaRegStar, FaStar } from 'react-icons/fa6';

export default function IconFavs({
  highlight,
  className,
  ...props
}: IconBaseProps & { highlight?: boolean}) {
  return highlight
    ? <FaStar
      {...props}
      className={clsx('text-amber-500', className)}
    />
    : <FaRegStar {...{ ...props, className }} />;
}
