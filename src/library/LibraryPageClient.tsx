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
import AdminLibraryMenu from './AdminLibraryMenu';
import { ReactNode, useMemo } from 'react';
import { Camera } from '@/camera';
import { Lens } from '@/lens';
import { Album } from '@/album';
import { useAppText } from '@/i18n/state/client';
import PhotoAvatar from '@/photo/PhotoAvatar';
import Link from 'next/link';
import { PATH_ADMIN_LIBRARY_EDIT } from '@/app/path';
import { LuCirclePlus, LuUser } from 'react-icons/lu';
import AdminEmptyState from '@/admin/AdminEmptyState';
import { Place } from '@/place';
import PlaceEntity from '@/place/PlaceEntity';
import LibrarySection from './LibrarySection';
import type { LibrarySetFolderRow } from '.';

export default function LibraryPageClient({
  title,
  subhead,
  descriptionHtml,
  photosCount = 0,
  photosOldest,
  photoAvatar,
  camera,
  lens,
  recipe,
  film,
  tag,
  place,
  album,
  lastUpdated,
  folderRows,
}: {
  title?: string
  subhead?: string
  descriptionHtml?: ReactNode
  photosCount?: number
  photosOldest?: string
  photoAvatar?: Photo
  camera?: Camera
  lens?: Lens
  recipe?: string
  film?: string
  tag?: string
  place?: Place
  album?: Album
  lastUpdated?: Date
  folderRows: LibrarySetFolderRow[]
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
      appText.library.photoCount,
      photosCount.toString().padStart(4, '0'),
    ),
    renderItem(
      appText.library.firstPhoto,
      photosOldest?.slice(0, 10),
    ),
    camera && renderItem(
      appText.library.topCamera,
      <PhotoCamera
        camera={camera}
        type="text-only"
        contrast="high"
      />,
    ),
    lens && renderItem(
      appText.library.topLens,
      <PhotoLens
        lens={lens}
        type="text-only"
        contrast="high"
      />,
    ),
    recipe && renderItem(
      appText.library.topRecipe,
      <PhotoRecipe
        recipe={recipe}
        type="text-only"
        contrast="high"
      />,
    ),
    film && renderItem(
      appText.library.topFilm,
      <PhotoFilm
        film={film}
        type="text-only"
        contrast="high"
        badged={false}
      />,
    ),
    tag && renderItem(
      appText.library.popularTag,
      <PhotoTag
        tag={tag}
        type="text-only"
        contrast="high"
      />,
    ),
    place && renderItem(
      appText.library.popularPlace,
      <PlaceEntity
        place={place}
        type="text-only"
        contrast="high"
        badged={false}
      />,
    ),
    album && renderItem(
      appText.library.recentAlbum,
      <PhotoAlbum
        album={album}
        type="text-only"
        contrast="high"
      />,
    ),
  ].filter(Boolean), [
    appText.library,
    photosCount,
    photosOldest,
    camera,
    lens,
    recipe,
    film,
    album,
    place,
    tag,
  ]);

  return (
    <AnimateItems
      type="bottom"
      animateOnFirstLoadOnly
      items={[<div
        key="library-page"
        className="space-y-12 mt-5"
      >
        <AppGrid
          contentMain={<div className="space-y-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <PhotoAvatar
                photo={photoAvatar}
                placeholder={<LuUser size={22} className="text-dim" />}
              />
              <div
                className={clsx('sm:flex items-center justify-between grow')}
              >
                <div>
                  <div className="font-bold">
                    {title || appText.library.titleDefault}
                  </div>
                  {subhead &&
                    <div>{subhead}</div>}
                </div>
                {lastUpdated && <div className={clsx('text-dim')}>
                  {appText.library.updated(
                    formatDistanceToNowStrict(lastUpdated),
                  )}
                </div>}
              </div>
              {isUserSignedIn && <AdminLibraryMenu />}
            </div>
            {descriptionHtml
              ? descriptionHtml
              : isUserSignedIn &&
                  <Link
                    href={PATH_ADMIN_LIBRARY_EDIT}
                    className={clsx(
                      'flex items-center justify-center gap-2.5',
                      'border border-dashed border-medium rounded-lg',
                    )}
                  >
                    <AdminEmptyState
                      icon={<LuCirclePlus size={22} />}
                      includeContainer={false}
                      className="gap-3! p-6!"
                    >
                      Add optional description
                    </AdminEmptyState>
                  </Link>}
            <AnimateItems
              className={clsx(
                'grid gap-x-2 gap-y-6 grid-cols-2 lg:grid-cols-4',
              )}
              items={items}
            />
          </div>}
        />
        {folderRows.length > 0 &&
          <AppGrid
            contentMain={<div className="space-y-8">
              {folderRows.map(({ key, title, folders }) =>
                <LibrarySection
                  key={key}
                  category={key}
                  title={title}
                  folders={folders}
                />)}
            </div>}
          />}
      </div>]}
    />
  );
}
