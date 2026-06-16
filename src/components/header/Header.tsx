'use client';

import { FC } from 'react';
import { clsx } from 'clsx/lite';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AppViewSwitcher, { SwitcherSelection } from '@/app/AppViewSwitcher';
import { PATH_ROOT, isPathFull, isPathGrid, isPathProtected } from '@/app/path';
import { GRID_HOMEPAGE_ENABLED, NAV_CAPTION } from '@/app/config';
import { useAppState } from '@/app/AppState';
import { useSession } from 'next-auth/react';
import AdminAppMenu from '@/admin/AdminAppMenu';

import SelectionMode from '@/components/header/components/SelectionMode';
import Title from '@/components/header/components/Title';
import Tools from '@/components/header/components/Tools';
import NoSelectionMode from '@/components/header/components/NoSelectionMode';

const NAV_HEIGHT_CLASS = NAV_CAPTION
  ? 'min-h-[4rem] sm:min-h-[5rem]'
  : 'min-h-[4rem]';

const Header: FC<{
  navRef: React.RefObject<HTMLElement | null>;
  classNameStickyNav?: string;
  navTitle: string;
  navCaption?: string;
}> = ({ navRef, classNameStickyNav, navTitle, navCaption }) => {
  const pathname = usePathname();

  const { status } = useSession();
  const { isUserAdmin } = useAppState();

  const switcherSelectionForPath = (): SwitcherSelection | undefined => {
    if (pathname === PATH_ROOT) {
      return GRID_HOMEPAGE_ENABLED ? 'grid' : 'full';
    } else if (isPathGrid(pathname)) {
      return 'grid';
    } else if (isPathFull(pathname)) {
      return 'full';
    } else if (isPathProtected(pathname)) {
      return 'admin';
    }
  };
  return (
    <nav
      ref={navRef}
      className={clsx(
        'w-full flex flex-col bg-main z-10 mb-4',
        NAV_HEIGHT_CLASS,
        classNameStickyNav,
      )}
    >
      <div className='flex py-[15px]'>
        <Title navTitle={navTitle} navCaption={navCaption} />
        <Tools />
      </div>

      <div className='flex'>
        <div className='w-1/2 flex items-center gap-0.5 sm:gap-1'>
          <AppViewSwitcher currentSelection={switcherSelectionForPath()} />

          {isUserAdmin && (
            <div className='relative'>
              <AdminAppMenu />
            </div>
          )}

          {status === 'authenticated' && (
            <>
              {/* Selection Buttons */}
              <SelectionMode />
              {/* View Selections Button */}
              <NoSelectionMode />
            </>
          )}
        </div>

        {/* Admin Button */}
        {isUserAdmin && (
          <div className='w-1/2 ml-3 sm:ml-4 text-right'>
            <Link
              href='/admin/photos'
              className={clsx(
                'font-mono link h-4 active:text-medium',
                'disabled:bg-transparent! hover:text-dim',
                'inline-flex items-center gap-1.5 self-start',
                'whitespace-nowrap focus:outline-hidden text-medium',
              )}
            >
              <span className='hidden sm:inline'>Admin</span>
              <span className='sm:hidden'>A</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
