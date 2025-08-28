import { clsx } from 'clsx/lite';
import { HTMLAttributes, ReactNode, RefObject } from 'react';

/*
  MAX WIDTHS
  Main: 956px +
  Sidebar: 308px +
  Gap: 16px =
  Total: 1280px
  -
  Column offset: (308px + 16px) / 2 = 162px
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
        'gap-3 md:gap-4',
        'max-w-[1280px] 3xl:w-[1280px]',
        // Offset sidebar width when centering on large screens
        '3xl:translate-x-[162px]',
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
