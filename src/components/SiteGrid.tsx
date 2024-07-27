import { clsx } from 'clsx/lite';
import { RefObject } from 'react';
import { CENTERED_LARGE_SCREENS } from '@/site/config';

export default function SiteGrid({
  containerRef,
  className,
  contentMain,
  contentSide,
  sideFirstOnMobile,
  sideHiddenOnMobile,
}: {
  containerRef?: RefObject<HTMLDivElement>
  className?: string
  contentMain: JSX.Element
  contentSide?: JSX.Element
  sideFirstOnMobile?: boolean
  sideHiddenOnMobile?: boolean
}) {
  return (
    <div
      ref={containerRef}
      className={clsx(
        'grid',
        'grid-cols-1 md:grid-cols-12',
        'gap-x-4 lg:gap-x-6',
        'gap-y-4',
        'max-w-7xl',
        CENTERED_LARGE_SCREENS && 'mx-auto',
        className,
      )}
    >
      <div className={clsx(
        // 'col-span-1 md:col-span-9', // original
        // 'col-span-1 md:col-span-9 md:col-start-2', // without env variable
        CENTERED_LARGE_SCREENS
          // ? 'col-span-1 md:col-span-9 md:col-start-2' // option for medium screens and up
          ? 'col-span-1 md:col-span-9 lg:col-start-2'
          : 'col-span-1 md:col-span-9',
        sideFirstOnMobile && 'order-2 md:order-none',
      )}>
        {contentMain}
      </div>
      {contentSide &&
        <div className={clsx(
          // 'col-span-1 md:col-span-3', // original
          // 'col-span-1 md:col-span-2', // without env variable
          CENTERED_LARGE_SCREENS
            // ? 'col-span-1 md:col-span-2' // option for medium screens and up
            ? 'col-span-1 md:col-span-3 lg:col-span-2'
            : 'col-span-1 md:col-span-3',
          sideFirstOnMobile && 'order-1 md:order-none',
          sideHiddenOnMobile && 'hidden md:block',
        )}>
          {contentSide}
        </div>}
    </div>
  );
};
