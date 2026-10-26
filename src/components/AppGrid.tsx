import { clsx } from 'clsx/lite';
import { HTMLAttributes, ReactNode, RefObject } from 'react';
import {
  LAYOUT_CLASS_COLS_WITH_SIDE_3XL,
  LAYOUT_CLASS_MAIN,
  LAYOUT_CLASS_SIDE_3XL,
  LAYOUT_CLASS_SIDE_OFFSET_3XL,
  LAYOUT_CLASS_WITH_SIDE_3XL,
} from '@/app/layout-metrics';

// Offsets sidebar width when centering on large screens.
// Applied to columns, not the container, so that consumer-supplied
// positioning ('sticky') isn't overridden at large widths.
const CLASS_COLUMN_OFFSET = LAYOUT_CLASS_SIDE_OFFSET_3XL;

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
  // When true, hide side until 3xl (beside). When false, stack side
  // below main until 3xl, then show beside.
  sideHiddenOnMobile?: boolean
} & HTMLAttributes<HTMLDivElement>) {
  const hasSide = Boolean(contentSide);

  return (
    <div
      {...props}
      ref={containerRef}
      className={clsx(
        'grid grid-cols-1',
        // Match nav width; expand only when sidebar sits beside at 3xl
        'w-full mx-auto',
        LAYOUT_CLASS_MAIN,
        hasSide && LAYOUT_CLASS_WITH_SIDE_3XL,
        hasSide && LAYOUT_CLASS_COLS_WITH_SIDE_3XL,
        'gap-3',
        // Don't block fields beneath side column when not present
        'pointer-events-none',
        className,
      )}
    >
      <div className={clsx(
        // Cap main at nav width, including inside 3xl sidebar grid
        'col-span-1 w-full',
        LAYOUT_CLASS_MAIN,
        hasSide && CLASS_COLUMN_OFFSET,
        sideFirstOnMobile && hasSide && 'order-2 3xl:order-none',
        // Reenable pointer events
        'pointer-events-auto',
        classNameMain,
      )}>
        {contentMain}
      </div>
      {contentSide &&
        <div className={clsx(
          'col-span-1 w-full',
          LAYOUT_CLASS_SIDE_3XL,
          CLASS_COLUMN_OFFSET,
          sideFirstOnMobile && 'order-1 3xl:order-none',
          sideHiddenOnMobile && 'max-3xl:hidden',
          // Reenable pointer events
          'pointer-events-auto',
          classNameSide,
        )}>
          {contentSide}
        </div>}
    </div>
  );
};
