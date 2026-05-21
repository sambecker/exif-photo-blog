'use client';



import { useSelection } from '@/selection/SelectionContext';
import { useSession } from 'next-auth/react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { Photo } from '@/photo';
import { PhotoSetCategories } from '@/category';
import AppGrid from '@/components/AppGrid';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import PhotoGridMobileFilters from '@/photo/PhotoGridMobileFilters';

export default function HomePageClient({
  photos,
  photosCount,
  _photosCountWithExcludes,
  categories,
}: {
  photos: Photo[],
  photosCount: number,
  _photosCountWithExcludes: number,
  categories: PhotoSetCategories,
}) {
  const {
    selectionMode,
    selectedPhotos,
    togglePhotoSelection,
  } = useSelection();



  const { data: session } = useSession();

  return (
    <div className="space-y-4">
      {/* Mobile filters - visible only on mobile */}
      <div className="md:hidden">
        <PhotoGridMobileFilters {...categories} />
      </div>

      <AppGrid
        sideHiddenOnMobile={true}
        contentMain={
          <PhotoGridPage
            photos={photos}
            selectionMode={selectionMode}
            selectedPhotos={selectedPhotos}
            togglePhotoSelection={togglePhotoSelection}
            userEmail={session?.user?.email ?? undefined}
            {...categories}
          />
        }
        contentSide={
          <PhotoGridSidebar {...categories} photosCount={photosCount} />
        }
      />
    </div>
  );
}
