import { clsx } from 'clsx/lite';
import { IconBaseProps } from 'react-icons';
import { BiImageAdd } from 'react-icons/bi';

export default function IconAddUpload({
  className,
  size,
  ...props
}: IconBaseProps) {
  return <BiImageAdd
    {...props}
    size={size ?? 18}
    className={clsx('translate-x-[1px] translate-y-[1px]', className)}
  />;
}
