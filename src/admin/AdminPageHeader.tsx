import { ReactNode } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { clsx } from 'clsx/lite';
import Badge from '@/components/Badge';
import Spinner from '@/components/Spinner';

export default function AdminPageHeader({
  title,
  nav,
  backPath,
  backLabel,
  breadcrumb,
  breadcrumbEllipsis,
  accessory,
  hideTitle,
  isLoading,
  className,
}: {
  title?: ReactNode
  nav?: ReactNode
  backPath?: string
  backLabel?: string
  breadcrumb?: ReactNode
  breadcrumbEllipsis?: boolean
  accessory?: ReactNode
  hideTitle?: boolean
  isLoading?: boolean
  className?: string
}) {
  const hasBreadcrumb = Boolean(backPath || breadcrumb);

  return (
    <div className={clsx(
      // Match button height so headers align with or without accessory
      'flex items-center min-h-9.5',
      hasBreadcrumb
        ? clsx('gap-x-2 gap-y-3', !breadcrumbEllipsis && 'flex-wrap')
        : 'gap-4',
      className,
    )}>
      {!hideTitle &&
        <div className={clsx(
          'grow flex items-center',
          hasBreadcrumb
            ? clsx(
              'gap-x-1.5 sm:gap-x-3 gap-y-1',
              breadcrumbEllipsis ? 'min-w-0' : 'flex-wrap',
            )
            : 'shrink-0 gap-3',
        )}>
          {backPath &&
            <Link
              href={backPath}
              className="flex gap-1.5 items-center"
            >
              <FiArrowLeft size={16} />
              <span className="hidden xs:inline-block">
                {backLabel || 'Back'}
              </span>
            </Link>}
          {breadcrumb &&
            <>
              <span>/</span>
              <Badge
                dimContent={isLoading}
                className={clsx(breadcrumbEllipsis && 'truncate')}
              >
                {breadcrumb}
              </Badge>
            </>}
          {title &&
            <div className="font-bold">
              {title}
            </div>}
          {nav}
          {isLoading &&
            <Spinner />}
        </div>}
      {accessory &&
        <div className={clsx(
          'flex items-center justify-end gap-2 min-w-0',
          hideTitle && 'grow w-full',
        )}>
          {accessory}
        </div>}
    </div>
  );
}
