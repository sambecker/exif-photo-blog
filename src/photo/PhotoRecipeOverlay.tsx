'use client';

import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import clsx from 'clsx/lite';
import ImageLarge from '@/components/image/ImageLarge';
import PhotoRecipe from './PhotoRecipe';
import { Photo } from '.';
import { useEffect, useState } from 'react';
export default function PhotoRecipeOverlay({
  photos,
  recipe,
  className,
}: {
  photos: Photo[]
  recipe: FujifilmRecipe
  className?: string
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  
  const photo = photos[photoIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((photoIndex + 1) % photos.length);
    }, 500);
    return () => clearInterval(interval);
  }, [photoIndex, photos]);

  return (
    <div className={clsx(
      'relative w-full aspect-[3/2]',
      className,
    )}>
      <ImageLarge
        src={photo.url}
        alt="Image Background"
        aspectRatio={3 / 2}
      />
      <div className={clsx(
        'absolute inset-0 w-full h-full',
        'flex items-center justify-center',
      )}>
        <PhotoRecipe {...{
          recipe,
          simulation: photo.filmSimulation ?? 'provia',
          exposure: photo.exposureCompensationFormatted ?? '+0ev',
          iso: photo.isoFormatted ?? 'ISO 0',
        }} />
      </div>
    </div>
  );
}
