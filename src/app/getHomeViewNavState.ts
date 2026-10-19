import {
  PATH_FULL_INFERRED,
  PATH_GRID_INFERRED,
  isPathFull,
  isPathGrid,
  isPathPhotoSet,
} from '@/app/path';

export type HomeView = 'grid' | 'full';

/**
 * Resolves full/grid nav active state and hrefs.
 *
 * - Photo set + inactive control → no href (caller toggles set view)
 * - Photo set + already-active control → root inferred homepage for that view
 * - Elsewhere → sort-aware paths from the current route
 */
export default function getHomeViewNavState({
  pathname,
  isPhotoSetFull,
  pathGrid,
  pathFull,
}: {
  pathname: string
  isPhotoSetFull?: boolean
  pathGrid: string
  pathFull: string
}) {
  const isPhotoSet = isPathPhotoSet(pathname);
  const isOnFullPath =
    pathname === PATH_FULL_INFERRED || isPathFull(pathname);
  const isOnGridPath =
    pathname === PATH_GRID_INFERRED || isPathGrid(pathname);

  const isViewFull = isPhotoSet ? Boolean(isPhotoSetFull) : isOnFullPath;
  const isViewGrid = isPhotoSet ? !isPhotoSetFull : isOnGridPath;

  const hrefGrid = isPhotoSet
    ? (isViewGrid ? PATH_GRID_INFERRED : undefined)
    : pathGrid;
  const hrefFull = isPhotoSet
    ? (isViewFull ? PATH_FULL_INFERRED : undefined)
    : pathFull;

  return {
    isPhotoSet,
    isOnFullPath,
    isOnGridPath,
    isViewFull,
    isViewGrid,
    hrefGrid,
    hrefFull,
    pathGridRoot: PATH_GRID_INFERRED,
    pathFullRoot: PATH_FULL_INFERRED,
  };
}
