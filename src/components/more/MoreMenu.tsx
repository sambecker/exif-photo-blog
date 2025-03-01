import {
  ComponentProps,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { FiMoreHorizontal } from 'react-icons/fi';
import MoreMenuItem from './MoreMenuItem';

export default function MoreMenu({
  items,
  icon,
  header,
  className,
  buttonClassName,
  buttonClassNameOpen,
  ariaLabel,
  align = 'end',
  onOpen,
  ...props
}: {
  items: ComponentProps<typeof MoreMenuItem>[]
  icon?: ReactNode
  header?: ReactNode
  className?: string
  buttonClassName?: string
  buttonClassNameOpen?: string
  ariaLabel: string
  onOpen?: () => void
} & ComponentProps<typeof DropdownMenu.Content>){
  const [isOpen, setIsOpen] = useState(false);

  const dismissMenu = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) { onOpen?.(); }
  }, [isOpen, onOpen]);

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={clsx(
            'p-1 min-h-0 border-none shadow-none hover:outline-hidden',
            'hover:bg-gray-100 active:bg-gray-100',
            'dark:hover:bg-gray-800/75 dark:active:bg-gray-900',
            'text-dim',
            buttonClassName,
            isOpen && buttonClassNameOpen,
          )}
          aria-label={ariaLabel}
        >
          {icon ?? <FiMoreHorizontal size={18} />}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          {...props}
          align={align}
          className={clsx(
            'z-10',
            'min-w-[8rem]',
            'component-surface',
            'p-1',
            'shadow-lg',
            'data-[side=top]:dark:shadow-[0_0px_40px_rgba(0,0,0,0.6)]',
            'data-[side=bottom]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
            'data-[side=top]:animate-fade-in-from-bottom',
            'data-[side=bottom]:animate-fade-in-from-top',
            className,
          )}
        >
          {header && <div className={clsx(
            'px-2 pt-3 pb-2 text-dim uppercase',
            'text-sm tracking-wide',
          )}>
            {header}
          </div>}
          {items.map(props =>
            <MoreMenuItem
              key={`${props.label}`}
              {...props}
              dismissMenu={dismissMenu}
            />,
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
