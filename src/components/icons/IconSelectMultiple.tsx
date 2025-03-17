import clsx from 'clsx/lite';
import { IconBaseProps } from 'react-icons';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { IoCloseSharp } from 'react-icons/io5';

export default function IconSelectMultiple({
  isSelecting,
  className,
  ...props
}: IconBaseProps & { isSelecting: boolean }) {
  return isSelecting
    ? <IoCloseSharp {...{
      ...props,
      className: clsx(
        'text-[18px] translate-x-[-1px] translate-y-[0.5px]',
        className,
      ),
    }} />
    : <ImCheckboxUnchecked
      {...{
        ...props,
        className: clsx(
          'translate-x-[-0.5px] translate-y-[0.5px] text-[0.75rem]',
          className,
        ),
      }}
    />;
}
