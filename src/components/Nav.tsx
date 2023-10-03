'use client';

import { cc } from '@/utility/css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SiteGrid from './SiteGrid';
import { SITE_DOMAIN_OR_TITLE } from '@/site/config';
import ViewSwitcher, { SwitcherSelection } from '@/photo/ViewSwitcher';
import {
  PATH_ADMIN,
  PATH_ROOT,
  isPathGrid,
  isPathProtected,
} from '@/site/paths';

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
    if (pathname === PATH_ROOT) {
      return 'full-frame';
    } else if (isPathGrid(pathname)) {
      return 'grid';
    } else if (isPathProtected(pathname)) {
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
                {renderLink('Home', PATH_ROOT)}
                {renderLink('Admin', PATH_ADMIN)}
              </>}
            </div>
            <div className="hidden xs:block">
              {renderLink(SITE_DOMAIN_OR_TITLE, PATH_ROOT)}
            </div>
          </>}
        </div>
      }
    />
  );
};
