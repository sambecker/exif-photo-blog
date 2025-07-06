import clsx from 'clsx/lite';
import { InputHTMLAttributes, ReactNode, RefObject } from 'react';
import { ImCheckmark } from 'react-icons/im';

const SIZE = 'size-4.5';

const boxStyles = clsx(
  'relative',
  'inline-flex items-center justify-center',
  'rounded-md border',
  SIZE,
);

export default function Checkbox({
  ref,
  className,
  accessory,
  type: _type,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'ref'> & {
  ref?: RefObject<HTMLInputElement | null>
  accessory?: ReactNode
}) {
  return (
    <span
      className={clsx(
        'relative inline-flex items-center justify-center',
        SIZE,
        props.readOnly
          ? 'cursor-not-allowed'
          : 'group-has-active:opacity-70',
      )}
      onClick={() => ref?.current?.click()}
    >
      {accessory
        ? accessory
        : props.checked
          ? <span className={clsx(
            boxStyles,
            'border-transparent dark:border-gray-700',
            props.readOnly
              ? 'bg-gray-300 dark:bg-gray-700'
              : 'bg-black',
          )}>
            <ImCheckmark
              size={11}
              className={clsx(
                'text-white',
                props.readOnly && 'dark:text-gray-400',
              )}
            />
          </span>
          : <span className={clsx(
            boxStyles,
            'bg-gray-100 dark:bg-gray-700/25',
            'border-gray-300 dark:border-gray-700',
          )} />}
      <input
        ref={ref}
        type="checkbox"
        className={clsx(
          'absolute inset-0 opacity-0! size-5',
          className,
        )}
        {...props}
      />
    </span>
  );
}
