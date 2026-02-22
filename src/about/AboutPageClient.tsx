'use client';

import { PhotoSetCategories } from '@/category';
import AppGrid from '@/components/AppGrid';
import ImageWithFallback from '@/components/image/ImageWithFallback';
import { altTextForPhoto, Photo } from '@/photo';
import clsx from 'clsx/lite';
import { formatDistanceToNowStrict } from 'date-fns';

export default function AboutPageClient({
  heroPhoto,
  categories,
  lastUpdated,
}: {
  heroPhoto?: Photo
  categories: PhotoSetCategories
  lastUpdated?: Date
}) {
  return (
    <AppGrid contentMain={<div className={clsx(
      'space-y-8 mt-5',
    )}>
      <div className={clsx('sm:flex items-center justify-between')}>
        <div>About this site</div>
        {lastUpdated && <div className={clsx('text-dim')}>
          Last updated {formatDistanceToNowStrict(
            lastUpdated,
            { addSuffix: true },
          )}
        </div>}
      </div>
      <div className={clsx('text-medium')}>
        {/* eslint-disable-next-line max-len */}
        A digital gallery dedicated to the beauty of the mundane. This blog explores the intersection of light, shadow, and silence. No filters, no noise—just the world as it sits when we stop to look.
      </div>
      {heroPhoto && <ImageWithFallback
        src={heroPhoto.url}
        alt={altTextForPhoto(heroPhoto)}
        blurDataURL={heroPhoto.blurData}
        width={heroPhoto.width}
        height={heroPhoto.height}
      />}
      <div className={clsx('grid grid-cols-3 gap-4')}>
        <div>Cameras ({categories.cameras.length})</div>
        <div>Lenses ({categories.lenses.length})</div>
        <div>Films ({categories.films.length})</div>
      </div>
    </div>} />
  );
}
