import { ReactNode } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import SiteGrid from './SiteGrid';
import { cc } from '@/utility/css';
import Badge from './Badge';

function AdminChildPage({
  backPath,
  backLabel,
  breadcrumb,
  accessory,
  children,
}: {
  backPath?: string
  backLabel?: string
  breadcrumb?: ReactNode
  accessory?: ReactNode
  children: ReactNode,
}) {
  return (
    <SiteGrid
      contentMain={
        <div className="space-y-6">
          {(backPath || breadcrumb || accessory) &&
            <div className={cc(
              'flex flex-wrap items-center gap-x-2 gap-y-3',
              'min-h-[2.25rem]', // min-h-9 equivalent
            )}>
              <div className={cc(
                'flex flex-wrap items-center gap-x-1.5 sm:gap-x-3 gap-y-1',
                'flex-grow',
              )}>
                {backPath &&
                  <Link
                    href={backPath}
                    className="flex gap-1.5 items-center"
                  >
                    <FiArrowLeft size={16} />
                    {backLabel || 'Back'}
                  </Link>}
                {breadcrumb &&
                  <>
                    <span>/</span>
                    <Badge>
                      {breadcrumb}
                    </Badge>
                  </>}
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
