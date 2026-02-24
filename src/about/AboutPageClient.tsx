'use client';

import PhotoAlbum from '@/album/PhotoAlbum';
import { useAppState } from '@/app/AppState';
import PhotoCamera from '@/camera/PhotoCamera';
import { PhotoSetCategories } from '@/category';
import AnimateItems from '@/components/AnimateItems';
import AppGrid from '@/components/AppGrid';
import ImageMedium from '@/components/image/ImageMedium';
import PhotoFilm from '@/film/PhotoFilm';
import PhotoLens from '@/lens/PhotoLens';
import { altTextForPhoto, Photo } from '@/photo';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import PhotoTag from '@/tag/PhotoTag';
import clsx from 'clsx/lite';
import { formatDistanceToNowStrict } from 'date-fns';
import AdminAboutMenu from './AdminAboutMenu';
import PhotoLarge from '@/photo/PhotoLarge';
import { ReactNode } from 'react';

export default function AboutPageClient({
  photoAvatar,
  photoHero,
  categories: { albums, tags, recipes, cameras, lenses, films },
  lastUpdated,
}: {
  photoAvatar?: Photo
  photoHero?: Photo
  categories: PhotoSetCategories
  lastUpdated?: Date
}) {
  const {
    isUserSignedIn,
  } = useAppState();

  const renderTopRow = (label: string, content: ReactNode) => (
    <div className="border-t border-medium pt-1 space-y-0.5">
      <div className="text-xs font-medium uppercase tracking-wider text-medium">
        {label}
      </div>
      {content}
    </div>
  );

  return (
    <AnimateItems
      type="bottom"
      items={[<div
        key="about-page"
        className="space-y-8 mt-5"
      >
        <AppGrid
          contentMain={<div className="space-y-8">
            <div className="flex items-center gap-4">
              {photoAvatar && <ImageMedium
                className="size-10 rounded-full overflow-auto"
                src={photoAvatar.url}
                alt={altTextForPhoto(photoAvatar)}
                blurDataURL={photoAvatar.blurData}
                aspectRatio={photoAvatar.aspectRatio}
              />}
              <div
                className={clsx('sm:flex items-center justify-between grow')}
              >
                <div>
                  <div className="font-bold">
                    About this site
                  </div>
                  <div>
                    A brief subhead here
                  </div>
                </div>
                {lastUpdated && <div className={clsx('text-dim')}>
                  Updated
                  {' '}
                  {formatDistanceToNowStrict(lastUpdated, { addSuffix: true })}
                </div>}
              </div>
              {isUserSignedIn && <AdminAboutMenu />}
            </div>
            <div className={clsx('text-medium')}>
              A digital gallery dedicated to the beauty of the mundane.
              This blog explores the intersection of light, shadow, and silence.
              No filters, no noise—just the world as it sits
              when we stop to look.
            </div>
            <div className={clsx(
              'grid gap-x-2 gap-y-4 grid-cols-2 lg:grid-cols-4',
            )}>
              <div>
                {renderTopRow(
                  'Top Camera',
                  <PhotoCamera camera={cameras[0].camera} />,
                )}
              </div>
              <div>
                {renderTopRow(
                  'Top Lens',
                  <PhotoLens lens={lenses[0].lens} />,
                )}
              </div>
              <div>
                {renderTopRow(
                  'Top Recipe',
                  <PhotoRecipe recipe={recipes[0].recipe} />,
                )}
              </div>
              <div>
                {renderTopRow(
                  'Top Film',
                  <PhotoFilm film={films[0].film} />,
                )}
              </div>
              <div>
                {renderTopRow(
                  'Most Recent Album',
                  <PhotoAlbum album={albums[0].album} />,
                )}
              </div>
              <div>
                {renderTopRow(
                  'Top Tag',
                  <PhotoTag tag={tags[1].tag} />,
                )}
              </div>
            </div>
          </div>} />
        {photoHero && <PhotoLarge photo={photoHero} />}
      </div>]}
    />
  );
}
