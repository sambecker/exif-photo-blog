import { clsx } from 'clsx/lite';
import { HTMLAttributes, ReactNode, RefObject } from 'react';

/*
  MAX WIDTHS
  Main: 954px +
  Sidebar: 302px +
  Gap: 24px =
  Total: 1280px
  -
  Column offset: (302px + 24px) / 2 = 163px
*/

export default function SiteGrid({
  containerRef,
  className,
  contentMain,
  contentSide,
  sideFirstOnMobile,
  sideHiddenOnMobile,
  ...props
}: {
  containerRef?: RefObject<HTMLDivElement | null>
  className?: string
  contentMain: ReactNode
  contentSide?: ReactNode
  sideFirstOnMobile?: boolean
  sideHiddenOnMobile?: boolean
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      ref={containerRef}
      className={clsx(
        'grid',
        'grid-cols-1 md:grid-cols-12',
        'gap-x-4 lg:gap-x-6',
        'gap-y-4',
        'max-w-[1280px]',
        // Offset sidebar width when centering on large screens
        '3xl:translate-x-[163px]',
        className,
      )}
    >
      <div className={clsx(
        'col-span-1 md:col-span-9',
        sideFirstOnMobile && 'order-2 md:order-none',
      )}>
        {contentMain}
      </div>
      {contentSide &&
        <div className={clsx(
          'col-span-1 md:col-span-3',
          sideFirstOnMobile && 'order-1 md:order-none',
          sideHiddenOnMobile && 'hidden md:block',
        )}>
          {contentSide}
        </div>}
    </div>
  );
};
