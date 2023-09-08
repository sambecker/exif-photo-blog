'use client';

import { cc } from '@/utility/css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SiteGrid from './SiteGrid';
import { SITE_DOMAIN_OR_TITLE } from '@/site/config';
import ViewSwitcher, { SwitcherSelection } from '@/photo/ViewSwitcher';

export default function Nav({ showTextLinks }: { showTextLinks?: boolean }) {
  const isLoggedIn = false;

  const pathname = usePathname();

  const showNav = !pathname.startsWith('/sign-in');

  const renderLink = (
    text: string,
    linkOrAction: string | (() => void),
  ) =>
    typeof linkOrAction === 'string'
      ? <Link href={linkOrAction}>{text}</Link>
      : <button onClick={linkOrAction}>{text}</button>;

  const switcherSelectionForPath = (): SwitcherSelection | undefined => {
    if (pathname === '/') {
      return 'full-frame';
    } else if (pathname === '/grid') {
      return 'grid';
    } else if (pathname.startsWith('/admin')) {
      return 'admin';
    }
  };

  return (
    <SiteGrid
      contentMain={
        <div className={cc(
          'flex items-center',
          'min-h-[4rem]',
          'leading-none',
        )}>
          {showNav && <>
            <div className="flex flex-grow items-center gap-4">
              <ViewSwitcher
                currentSelection={switcherSelectionForPath()}
                showAdmin={isLoggedIn}
              />
              {showTextLinks && <>
                {renderLink('Home', '/')}
                {renderLink('Admin', '/admin')}
              </>}
            </div>
            <div className="hidden xs:block">
              {renderLink(SITE_DOMAIN_OR_TITLE, '/')}
            </div>
          </>}
        </div>
      }
    />
  );
};
