import { ReactNode } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import SiteGrid from './SiteGrid';
import { cc } from '@/utility/css';

function AdminChildPage({
  backPath,
  backLabel,
  breadcrumb,
  children,
}: {
  backPath?: string
  backLabel?: string
  breadcrumb?: ReactNode
  children: ReactNode,
}) {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          {backPath &&
            <div className={cc(
              'flex flex-wrap items-center gap-x-1.5 sm:gap-x-3 gap-y-1',
              'h-9',
            )}>
              <Link
                href={backPath}
                className="flex gap-1.5 items-center"
              >
                <FiArrowLeft size={16} />
                {backLabel || 'Back'}
              </Link>
              {breadcrumb &&
                <>
                  <span>/</span>
                  <span className={cc(
                    'py-0.5 px-2 rounded-md bg-gray-100 dark:bg-gray-900',
                    'border border-gray-200 dark:border-gray-800'
                  )}>
                    {breadcrumb}
                  </span>
                </>}
            </div>}
          <div>
            {children}
          </div>
        </div>}
    />
  );
};

export default AdminChildPage;
