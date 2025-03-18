import { clsx } from 'clsx/lite';
import { InputHTMLAttributes, ReactNode, useRef } from 'react';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

const ICON_CLASS_NAME = 'text-[1rem]';

export default function SimpleCheckbox(props: {
  children?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>) {
  const {
    children,
    className,
    type: _type,
    ...rest
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <label
      className={clsx(
        'inline-flex items-center gap-2 text-main',
        'cursor-pointer active:opacity-50',
        className,
      )}
      onClick={() => {
        if (inputRef.current) {
          inputRef.current.checked = !inputRef.current.checked;
        }
      }}
    >
      <input
        {...rest}
        ref={inputRef}
        type="checkbox"
        className="hidden"
      />
      <span>
        {rest.checked 
          ? <ImCheckboxChecked className={ICON_CLASS_NAME} />
          : <ImCheckboxUnchecked className={ICON_CLASS_NAME} />}
      </span>
      {children && <span>
        {children}
      </span>}
    </label>
  );
}
