import { clsx } from 'clsx/lite';
import { HTMLAttributes, ReactNode, RefObject } from 'react';

/*
  MAX WIDTHS
  Main: 956px +
  Sidebar: 200px +
  Gap: 16px =
  Total: 1172px
    -
  Column offset: (200px + 16px) / 2 = 108px
  (keeps main optically centered with nav)

  Below 3xl (87rem / 1392px): main-width column only (956px) —
  full width until centered, matching site nav (never left-aligned).
  3xl+ with sidebar: centered 1172px layout; columns offset so main
  aligns with nav. Without sidebar: stay at main width (956px).

  3xl is set ~240px earlier than the prior 102rem / 1632px threshold,
  which was sized for a 1280px / 162px-offset grid.
*/

export const APP_GRID_WIDTH_MAIN = 956;

// Offsets sidebar width when centering on large screens.
// Applied to columns, not the container, so that consumer-supplied
// positioning ('sticky') isn't overridden at large widths.
const CLASS_COLUMN_OFFSET = '3xl:relative 3xl:left-[108px]';

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
        // Match nav: main width until 3xl sidebar layout expands
        'w-full mx-auto max-w-[956px]',
        hasSide && '3xl:max-w-[1172px] 3xl:w-[1172px]',
        hasSide && '3xl:grid-cols-[minmax(0,956px)_200px] 3xl:gap-4',
        'gap-3',
        // Don't block fields beneath side column when not present
        'pointer-events-none',
        className,
      )}
    >
      <div className={clsx(
        // Always cap main at nav width (956px), including inside 3xl sidebar grid
        'col-span-1 w-full max-w-[956px]',
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
          'col-span-1 w-full 3xl:max-w-[200px]',
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
