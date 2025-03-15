import clsx from 'clsx/lite';
import { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { ImCheckmark } from 'react-icons/im';

const boxStyles = clsx(
  'relative',
  'inline-flex items-center justify-center',
  'size-5 rounded-md border',
);

export default function Checkbox({
  ref,
  className,
  accessory,
  type: _type,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>
  accessory?: ReactNode
}) {
  return (
    <span className={clsx(
      'relative inline-flex items-center justify-center',
      'size-5',
      'group-has-active:opacity-70',
    )}>
      {accessory
        ? accessory
        : props.checked
          ? <span className={clsx(
            boxStyles,
            'border-transparent',
            'bg-blue-600',
          )}>
            <ImCheckmark className="text-white text-[11px]" />
          </span>
          : <span className={clsx(
            boxStyles,
            'border-gray-300 dark:border-gray-700',
            'bg-gray-100 dark:bg-gray-700/25',
          )} />}
      <input
        ref={ref}
        type="checkbox"
        className={clsx(
          'absolute inset-0 invisible',
          className,
        )}
        {...props}
      />
    </span>
  );
}
