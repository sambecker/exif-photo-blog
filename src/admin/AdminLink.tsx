import clsx from 'clsx/lite';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { FiExternalLink } from 'react-icons/fi';
export default function AdminLink({
  href,
  className,
  children,
  externalIcon,
  ...props
}: ComponentProps<typeof Link> & {
  externalIcon?: boolean
}) {
  return (
    <>
      <Link
        {...props}
        href={href}
        target="blank"
        className={className}
      >
        <span className={clsx(
          'underline underline-offset-4',
          'decoration-gray-300 dark:decoration-gray-700',
        )}>
          {children}
        </span>
        {externalIcon && <span className="whitespace-nowrap">
          &nbsp;
          <FiExternalLink
            size={14}
            className="inline translate-y-[-1.5px]"
          />
        </span>}
      </Link>
    </>
  );
}
