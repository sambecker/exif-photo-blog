'use client';

import PhotoAlbum from '@/album/PhotoAlbum';
import { useAppState } from '@/app/AppState';
import PhotoCamera from '@/camera/PhotoCamera';
import { PhotoSetCategories } from '@/category';
import AnimateItems from '@/components/AnimateItems';
import AppGrid from '@/components/AppGrid';
import HeaderList from '@/components/HeaderList';
import IconAlbum from '@/components/icons/IconAlbum';
import IconCamera from '@/components/icons/IconCamera';
import IconFilm from '@/components/icons/IconFilm';
import IconLens from '@/components/icons/IconLens';
import IconRecipe from '@/components/icons/IconRecipe';
import IconTag from '@/components/icons/IconTag';
import ImageLarge from '@/components/image/ImageLarge';
import ImageMedium from '@/components/image/ImageMedium';
import PhotoFilm from '@/film/PhotoFilm';
import { useAppText } from '@/i18n/state/client';
import PhotoLens from '@/lens/PhotoLens';
import { altTextForPhoto, Photo } from '@/photo';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import PhotoTag from '@/tag/PhotoTag';
import clsx from 'clsx/lite';
import { formatDistanceToNowStrict } from 'date-fns';
import AdminAboutMenu from './AdminAboutMenu';

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

  const appText = useAppText();

  const albumsContent = albums.length > 0
    ? <HeaderList
      key="albums"
      title={appText.category.albumPlural}
      icon={<IconAlbum size={14} />}
      items={albums
        .map(({ album, count }) =>
          <PhotoAlbum
            key={album.slug}
            album={album}
            type="text-only"
            hoverCount={count} 
            prefetch={false} 
            contrast="low"
            badged
          />)}
    />
    : null;

  const tagsContent = tags.length > 0
    ? <HeaderList
      key="tags"
      title={appText.category.tagPlural}
      icon={<IconTag size={14} />}
      items={tags
        .map(({ tag, count }) =>
          <PhotoTag
            key={tag}
            tag={tag}
            type="text-only"
            hoverCount={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
    />
    : null;

  const recipeContent = recipes.length > 0
    ? <HeaderList
      key="recipes"
      title={appText.category.recipePlural}
      icon={<IconRecipe size={14} />}
      items={recipes
        .map(({ recipe, count }) =>
          <PhotoRecipe
            key={recipe}
            recipe={recipe}
            type="text-only"
            hoverCount={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
    />
    : null;

  const camerasContent = cameras.length > 0
    ? <HeaderList
      key="cameras"
      title={appText.category.cameraPlural}
      icon={<IconCamera
        size={14}
        className="translate-x-[1px]"
      />}
      items={cameras
        .map(({ cameraKey, camera, count }) =>
          <PhotoCamera
            key={cameraKey}
            camera={camera}
            type="text-only"
            hoverCount={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
    />
    : null;

  const lensesContent = lenses.length > 0
    ? <HeaderList
      key="lenses"
      title={appText.category.lensPlural}
      icon={<IconLens size={15} />}
      items={lenses
        .map(({ lensKey, lens, count }) =>
          <PhotoLens
            key={lensKey}
            lens={lens}
            type="text-only"
            hoverCount={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
    />
    : null;

  const filmsContent = films.length > 0
    ? <HeaderList
      key="films"
      title={appText.category.filmPlural}
      icon={<IconFilm size={15} />}
      items={films
        .map(({ film, count }) =>
          <PhotoFilm
            key={film}
            film={film}
            hoverCount={count}
            type="text-only"
            prefetch={false}
            badged
          />)}
    />
    : null;

  return (
    <AnimateItems
      type="bottom"
      items={[<AppGrid
        key="about-page"
        contentMain={<div className={clsx(
          'space-y-8 mt-5',
        )}>
          <div className="flex items-center gap-4">
            {photoAvatar && <ImageMedium
              className="size-10 rounded-full overflow-auto"
              src={photoAvatar.url}
              alt={altTextForPhoto(photoAvatar)}
              blurDataURL={photoAvatar.blurData}
              aspectRatio={photoAvatar.aspectRatio}
            />}
            <div className={clsx('sm:flex items-center justify-between grow')}>
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
            {/* eslint-disable-next-line max-len */}
            A digital gallery dedicated to the beauty of the mundane. This blog explores the intersection of light, shadow, and silence. No filters, no noise—just the world as it sits when we stop to look.
          </div>
          {photoHero && <ImageLarge
            src={photoHero.url}
            alt={altTextForPhoto(photoHero)}
            blurDataURL={photoHero.blurData}
            aspectRatio={photoHero.aspectRatio}
          />}
          <div className={clsx(
            'grid gap-4',
            'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ',
          )}>
            {[
              albumsContent,
              tagsContent,
              recipeContent,
              camerasContent,
              lensesContent,
              filmsContent,
            ].map((item, index) => (
              <div
                key={index}
                className="pt-1 border-t border-gray-200 dark:border-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>} />]}
    />
  );
}
