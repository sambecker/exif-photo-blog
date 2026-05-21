'use client';



import { useSelection } from '@/selection/SelectionContext';
import { useSession } from 'next-auth/react';
import { Photo } from '@/photo';
import { PhotoSetCategories } from '@/category';
import AppGrid from '@/components/AppGrid';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import PhotoGridMobileFilters from '@/photo/PhotoGridMobileFilters';
import PhotoGridContainer from '@/photo/PhotoGridContainer';
import { PATH_GRID_INFERRED } from '@/app/path';
import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { SortBy } from '@/photo/sort';

export default function HomePageClient({
  photos,
  photosCount,
  _photosCountWithExcludes,
  categories,
  sortBy,
  sortWithPriority,
}: {
  photos: Photo[],
  photosCount: number,
  _photosCountWithExcludes: number,
  categories: PhotoSetCategories,
  sortBy?: SortBy,
  sortWithPriority?: boolean,
}) {
  const {
    selectionMode: _selectionMode,
    selectedPhotos: _selectedPhotos,
    togglePhotoSelection: _togglePhotoSelection,
  } = useSelection();

  const { data: session } = useSession();

  return (
    <div className="space-y-4">
      {/* Mobile filters - visible only on mobile */}
      <div className="md:hidden">
        <PhotoGridMobileFilters {...categories} />
      </div>

      <PhotoGridContainer
        cacheKey={`page-${PATH_GRID_INFERRED}`}
        photos={photos}
        count={photosCount}
        sortBy={sortBy ?? USER_DEFAULT_SORT_OPTIONS.sortBy}
        sortWithPriority={sortWithPriority ?? USER_DEFAULT_SORT_OPTIONS.sortWithPriority}
        excludeFromFeeds
        prioritizeInitialPhotos
        userEmail={session?.user?.email ?? undefined}
        {...categories}
        sidebar={
          <PhotoGridSidebar {...categories} photosCount={photosCount} />
        }
      />
    </div>
  );
}
