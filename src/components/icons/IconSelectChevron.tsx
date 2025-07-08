import clsx from 'clsx/lite';
import { IconBaseProps } from 'react-icons';
import { FiChevronDown } from 'react-icons/fi';

export default function IconSelectChevron({
  className,
  ...props
}: IconBaseProps) {
  return (
    <FiChevronDown
      {...props}
      size={props.size ?? 16}
      className={clsx(
        'text-extra-dim text-2xl',
        className,
      )}
    />
  );
}
