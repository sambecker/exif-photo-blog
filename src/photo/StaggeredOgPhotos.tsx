'use client';

import { Photo } from '@/photo';
import PhotoOGTile from './PhotoOGTile';

export default function StaggeredOgPhotos({
  photos,
  onLastPhotoVisible,
}: {
  photos: Photo[]
  maxConcurrency?: number
  onLastPhotoVisible?: () => void
}) {
  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo, index) =>
        <PhotoOGTile
          key={photo.id}
          photo={photo}
          onVisible={index === photos.length - 1
            ? onLastPhotoVisible
            : undefined}
          riseOnHover
        />)}
    </div>
  );
};
