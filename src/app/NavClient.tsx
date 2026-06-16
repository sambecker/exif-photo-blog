'use client';

import { FC, useRef } from 'react';
import { usePathname } from 'next/navigation';
import AppGrid from '@/components/AppGrid';
import { isPathAdmin, isPathSignIn } from '@/app/path';
import AnimateItems from '@/components/AnimateItems';
import useStickyNav from '@/app/useStickyNav';
import Header from '@/components/header/Header';

const NavClient: FC<{
  navTitle: string;
  navCaption?: string;
  animate: boolean;
}> = ({ navTitle, navCaption, animate }) => {
  const ref = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const showNav = !isPathSignIn(pathname);

  const { classNameStickyContainer, classNameStickyNav } = useStickyNav(
    ref,
    !isPathAdmin(pathname),
  );

  return (
    <AppGrid
      className={classNameStickyContainer}
      classNameMain='pointer-events-auto'
      contentMain={
        <AnimateItems
          animateOnFirstLoadOnly
          type={animate && !isPathAdmin(pathname) ? 'bottom' : 'none'}
          distanceOffset={10}
          items={
            showNav
              ? [
                  <Header
                    key='nav'
                    navRef={ref}
                    classNameStickyNav={classNameStickyNav}
                    navTitle={navTitle}
                    navCaption={navCaption}
                  />,
                ]
              : []
          }
        />
      }
    />
  );
};

export default NavClient;
