import { ReactNode } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import SiteGrid from './SiteGrid';
import { clsx } from 'clsx/lite';
import Badge from './Badge';
import Spinner from './Spinner';

function AdminChildPage({
  backPath,
  backLabel,
  breadcrumb,
  breadcrumbEllipsis,
  accessory,
  isLoading,
  children,
}: {
  backPath?: string
  backLabel?: string
  breadcrumb?: ReactNode
  breadcrumbEllipsis?: boolean
  accessory?: ReactNode
  isLoading?: boolean
  children: ReactNode,
}) {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          {(backPath || breadcrumb || accessory) &&
            <div className={clsx(
              'flex items-center gap-x-2 gap-y-3',
              !breadcrumbEllipsis && 'flex-wrap',
              'min-h-[2.25rem]', // min-h-9 equivalent
            )}>
              <div className={clsx(
                'flex items-center gap-x-1.5 sm:gap-x-3 gap-y-1',
                'flex-grow',
                breadcrumbEllipsis ? 'min-w-0' : 'flex-wrap',
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
                      className={clsx(
                        breadcrumbEllipsis && 'text-ellipsis truncate',
                      )}
                    >
                      {breadcrumb}
                    </Badge>
                  </>}
                {isLoading &&
                  <Spinner />}
              </div>
              {accessory &&
                <div>{accessory}</div>}
            </div>}
          <div>
            {children}
          </div>
        </div>}
    />
  );
};

export default AdminChildPage;
