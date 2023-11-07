'use client';

import { cc } from '@/utility/css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SiteGrid from '../components/SiteGrid';
import { SITE_DOMAIN_OR_TITLE } from '@/site/config';
import ViewSwitcher, { SwitcherSelection } from '@/site/ViewSwitcher';
import {
  PATH_ADMIN,
  PATH_ROOT,
  isPathAdmin,
  isPathGrid,
  isPathProtected,
  isPathSets,
  isPathSignIn,
} from '@/site/paths';
import AnimateItems from '../components/AnimateItems';

export default function Nav({ showTextLinks }: { showTextLinks?: boolean }) {
  const isLoggedIn = false;

  const pathname = usePathname();

  const showNav = !isPathSignIn(pathname);

  const shouldAnimate = !isPathAdmin(pathname);

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
    } else if (isPathSets(pathname)) {
      return 'sets';
    } else if (isPathProtected(pathname)) {
      return 'admin';
    }
  };

  return (
    <SiteGrid
      contentMain={
        <AnimateItems
          type={!shouldAnimate ? 'none' : 'bottom'}
          distanceOffset={10}
          items={showNav
            ? [<div
              key="nav"
              className={cc(
                'flex items-center',
                'w-full min-h-[4rem]',
                'leading-none',
              )}>
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
            </div>]
            : []}
        />
      }
    />
  );
};
