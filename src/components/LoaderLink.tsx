import { ComponentProps, ReactNode } from 'react';
import LinkWithStatus from './LinkWithStatus';
import Spinner from './Spinner';
import clsx from 'clsx/lite';

export default function LoaderLink({
  icon,
  classNameIcon,
  classNameWrapper,
  classNameContent,
  children,
  ...props
}: Omit<ComponentProps<typeof LinkWithStatus>, 'children'> & {
  icon?: ReactNode
  classNameIcon?: string
  classNameWrapper?: string
  classNameContent?: string
  children?: ReactNode
}) {
  return (
    <LinkWithStatus {...props}>
      {({ isLoading }) =>
        <span className={clsx(
          'inline-flex items-center gap-1.5',
          classNameWrapper,
        )}>
          {icon &&
            <span className={clsx(
              'relative inline-flex items-center justify-center shrink-0',
              // Fallback when caller doesn’t pass
              // fixed slot (e.g. MoreMenuItem)
              !classNameIcon && 'min-w-[1.25rem] h-5',
              classNameIcon,
            )}>
              <span className={clsx(isLoading && 'invisible')}>{icon}</span>
              {isLoading &&
                <span className={clsx(
                  'absolute inset-0 flex items-center justify-center',
                )}>
                  <Spinner />
                </span>}
            </span>}
          {children &&
            <span className={clsx(
              isLoading && !icon && 'text-dim',
              classNameContent,
            )}>
              {children}
            </span>}
        </span>}
    </LinkWithStatus>
  );
}
