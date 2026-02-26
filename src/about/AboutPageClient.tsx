'use client';

import PhotoAlbum from '@/album/PhotoAlbum';
import { useAppState } from '@/app/AppState';
import PhotoCamera from '@/camera/PhotoCamera';
import AnimateItems from '@/components/AnimateItems';
import AppGrid from '@/components/AppGrid';
import PhotoFilm from '@/film/PhotoFilm';
import PhotoLens from '@/lens/PhotoLens';
import { Photo } from '@/photo';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import PhotoTag from '@/tag/PhotoTag';
import clsx from 'clsx/lite';
import { formatDistanceToNowStrict } from 'date-fns';
import AdminAboutMenu from './AdminAboutMenu';
import PhotoLarge from '@/photo/PhotoLarge';
import { ReactNode, useMemo } from 'react';
import { Camera } from '@/camera';
import { Lens } from '@/lens';
import { Album } from '@/album';
import { useAppText } from '@/i18n/state/client';
import PhotoAvatar from '@/photo/PhotoAvatar';

export default function AboutPageClient({
  title,
  subhead,
  description,
  photosCount = 0,
  photosOldest,
  photoAvatar,
  photoHero,
  camera,
  lens,
  recipe,
  film,
  album,
  tag,
  lastUpdated,
}: {
  title?: string
  subhead?: string
  description?: ReactNode
  photosCount?: number
  photosOldest?: string
  photoAvatar?: Photo
  photoHero?: Photo
  camera?: Camera
  lens?: Lens
  recipe?: string
  film?: string
  album?: Album
  tag?: string
  lastUpdated?: Date
}) {
  const {
    isUserSignedIn,
  } = useAppState();

  const appText = useAppText();

  const renderItem = (label: string, content?: ReactNode) => (
    <div
      key={label}
      className="border-t border-medium pt-1 space-y-px"
    >
      <div className="text-[13px] uppercase tracking-wide text-dim truncate">
        {label}
      </div>
      <div className="text-[16px] truncate">
        {content || '--'}
      </div>
    </div>
  );

  const items = useMemo(() => [
    renderItem(
      'Photo Count',
      photosCount.toString().padStart(4, '0'),
    ),
    renderItem(
      'First Photo',
      photosOldest?.slice(0, 10),
    ),
    camera && renderItem(
      'Top Camera',
      <PhotoCamera
        camera={camera}
        type="text-only"
        contrast="high"
      />,
    ),
    lens && renderItem(
      'Top Lens',
      <PhotoLens
        lens={lens}
        type="text-only"
        contrast="high"
      />,
    ),
    recipe && renderItem(
      'Top Recipe',
      <PhotoRecipe
        recipe={recipe}
        type="text-only"
        contrast="high"
      />,
    ),
    film && renderItem(
      'Top Film',
      <PhotoFilm
        film={film}
        type="text-only"
        contrast="high"
        badged={false}
      />,
    ),
    album && renderItem(
      'Recent Album',
      <PhotoAlbum
        album={album}
        type="text-only"
        contrast="high"
      />,
    ),
    tag && renderItem(
      'Top Tag',
      <PhotoTag
        tag={tag}
        type="text-only"
        contrast="high"
      />,
    ),
  ].filter(Boolean), [
    photosCount,
    photosOldest,
    camera,
    lens,
    recipe,
    film,
    album,
    tag,
  ]);

  return (
    <AnimateItems
      type="bottom"
      items={[<div
        key="about-page"
        className="space-y-12 mt-5"
      >
        <AppGrid
          contentMain={<div className="space-y-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <PhotoAvatar photo={photoAvatar} />
              <div
                className={clsx('sm:flex items-center justify-between grow')}
              >
                <div>
                  <div className="font-bold">
                    {title || appText.about.titleDefault}
                  </div>
                  {subhead && <div>
                    {subhead}
                  </div>}
                </div>
                {lastUpdated && <div className={clsx('text-dim')}>
                  Updated
                  {' '}
                  {formatDistanceToNowStrict(lastUpdated, { addSuffix: true })}
                </div>}
              </div>
              {isUserSignedIn && <AdminAboutMenu />}
            </div>
            {description &&
              <div className="text-medium [&>*>a]:underline">
                {description}
              </div>}
            <AnimateItems
              className={clsx(
                'grid gap-x-2 gap-y-6 grid-cols-2 lg:grid-cols-4',
              )}
              items={items}
            />
          </div>} />
        {photoHero &&
          <PhotoLarge photo={photoHero} />}
      </div>]}
    />
  );
}
