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

export default function AppGrid({
  containerRef,
  className,
  classNameMain,
  classNameSide,
  contentMain,
  contentSide,
  sideFirstOnMobile,
  sideHiddenOnMobile = true,
  ...props
}: {
  containerRef?: RefObject<HTMLDivElement | null>
  className?: string
  classNameMain?: string
  classNameSide?: string
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
        'max-w-[1280px] 3xl:w-[1280px]',
        // Offset sidebar width when centering on large screens
        '3xl:translate-x-[163px]',
        className,
      )}
    >
      <div className={clsx(
        'col-span-1 md:col-span-9',
        sideFirstOnMobile && 'order-2 md:order-none',
        classNameMain,
      )}>
        {contentMain}
      </div>
      {contentSide &&
        <div className={clsx(
          'col-span-1 md:col-span-3',
          '3xl:max-w-[260px]',
          sideFirstOnMobile && 'order-1 md:order-none',
          sideHiddenOnMobile && 'max-md:hidden',
          classNameSide,
        )}>
          {contentSide}
        </div>}
    </div>
  );
};
