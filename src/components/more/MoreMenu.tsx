import { ComponentProps } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { FiMoreHorizontal } from 'react-icons/fi';
import MoreMenuItem from './MoreMenuItem';

export default function MoreMenu({
  items,
  className,
  buttonClassName,
  ariaLabel,
}: {
  items: ComponentProps<typeof MoreMenuItem> []
  className?: string
  buttonClassName?: string
  ariaLabel: string
}){
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={clsx(
            buttonClassName,
            'p-1 min-h-0 border-none shadow-none hover:outline-none',
            'hover:bg-gray-100 active:bg-gray-100',
            'hover:dark:bg-gray-800/75 active:dark:bg-gray-900',
            'text-dim',
          )}
          aria-label={ariaLabel}
        >
          <FiMoreHorizontal size={18} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className={clsx(
            'z-10',
            'min-w-[8rem]',
            'ml-2.5',
            'p-1 rounded-md border',
            'bg-content',
            'shadow-lg dark:shadow-xl',
            className,
          )}
        >
          {items.map(props =>
            <MoreMenuItem key={`${props.label}`} {...props} />,
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
