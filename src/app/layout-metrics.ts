/* eslint-disable @stylistic/max-len */

/**
 * Sitewide layout rules
 *
 * 1. Content width = nav width (LAYOUT_MAIN) unless sidebar sits beside at 3xl
 * 2. Sidebar beside only at 3xl (87rem / 1392px in tailwind.css); offset keeps
 *    main optically centered with the nav
 * 3. Body is `3xl:flex items-center` with shell `self-stretch` (app/layout.tsx)
 * 4. With EXPRESSIVE_LAYOUT: matted /grid feed (no sidebar) may exceed nav
 *    width at lg+ (LAYOUT_FEED); below lg it is full content width so
 *    horizontal photos meet page margins (gap-x-1 / gap-y-2)
 * 5. Home grid with sidebar stays on LAYOUT_MAIN / WITH_SIDE; set/detail grids
 *    are not matted. Expressive full feed = PhotoExpressive*; otherwise / default
 *    full = PhotoLarge / PhotosLarge. Set full always = PhotoLarge
 *
 * Math (px):
 *   Main + gap + side = LAYOUT_WITH_SIDE
 *   Side offset        = (side + gap) / 2  → keeps main centered with nav
 */

export const LAYOUT_MAIN = 956;
export const LAYOUT_SIDE = 200;
export const LAYOUT_GAP = 16;
export const LAYOUT_WITH_SIDE = LAYOUT_MAIN + LAYOUT_GAP + LAYOUT_SIDE; // 1172
export const LAYOUT_SIDE_OFFSET = (LAYOUT_SIDE + LAYOUT_GAP) / 2; // 108
/** Matted grid feed without sidebar —
 * wider than nav at lg+, similar to /full */
export const LAYOUT_FEED = 1100;

/** Tailwind max-width / width classes derived from the tokens above */
export const LAYOUT_CLASS_MAIN = 'max-w-[956px]';
/** Expressive matted feed: uncapped below lg; wider than nav from lg up */
export const LAYOUT_CLASS_FEED = 'lg:max-w-[1100px]';
export const LAYOUT_CLASS_WITH_SIDE_3XL = '3xl:max-w-[1172px] 3xl:w-[1172px]';
export const LAYOUT_CLASS_SIDE_3XL = '3xl:max-w-[200px]';
export const LAYOUT_CLASS_SIDE_OFFSET_3XL = '3xl:relative 3xl:left-[108px]';
export const LAYOUT_CLASS_COLS_WITH_SIDE_3XL = '3xl:grid-cols-[minmax(0,956px)_200px] 3xl:gap-4';
