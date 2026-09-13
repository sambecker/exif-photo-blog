'use client';

import PhotoCamera from '@/camera/PhotoCamera';
import HeaderList from '@/components/HeaderList';
import PhotoTag from '@/tag/PhotoTag';
import { photoQuantityText } from '.';
import {
  TAG_FAVS,
  TAG_PRIVATE,
  addPrivateToTags,
  limitTagsByCount,
} from '@/tag';
import PhotoFilm from '@/film/PhotoFilm';
import PhotoFavs from '../tag/PhotoFavs';
import { useAppState } from '@/app/AppState';
import { useMemo, useRef } from 'react';
import PhotoPrivate from '@/tag/PhotoPrivate';
import {
  CATEGORY_VISIBILITY,
  HIDE_TAGS_WITH_ONE_PHOTO,
} from '@/app/config';
import { clsx } from 'clsx/lite';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import {
  getCategoriesWithItemsCount,
  getCategoryTitle,
  PhotoSetCategories,
} from '@/category';
import CategoryIcon from '@/category/CategoryIcon';
import PhotoFocalLength from '@/focal/PhotoFocalLength';
import PhotoLens from '@/lens/PhotoLens';
import useElementHeight from '@/utility/useElementHeight';
import { useAppText } from '@/i18n/state/client';
import PhotoYear from '@/year/PhotoYear';
import { chunkArray } from '@/utility/array';
import PhotoRecents from '@/recents/PhotoRecents';
import PhotoAlbum from '@/album/PhotoAlbum';

const APPROXIMATE_ITEM_HEIGHT = 40;
const ABOUT_HEIGHT_OFFSET = 24;

export default function PhotoGridSidebar({
  photosCount,
  containerHeight,
  aboutTextSafelyParsedHtml,
  aboutTextHasBrParagraphBreaks,
  className,
  ..._categories
}: PhotoSetCategories & {
  photosCount: number
  containerHeight?: number
  aboutTextSafelyParsedHtml?: string
  aboutTextHasBrParagraphBreaks?: boolean
  className?: string
}) {
  const categories = useMemo(() => HIDE_TAGS_WITH_ONE_PHOTO
    ? {
      ..._categories,
      tags: limitTagsByCount(_categories.tags, 2),
    }
    : _categories
  , [_categories]);

  const {
    recents,
    years,
    cameras,
    lenses,
    albums,
    tags,
    films,
    recipes,
    focalLengths,
  } = categories;

  const yearRows = useMemo(() => chunkArray(years, 3), [years]);

  const categoriesCount = getCategoriesWithItemsCount(
    CATEGORY_VISIBILITY,
    categories,
  );

  const appText = useAppText();

  const aboutRef = useRef<HTMLParagraphElement>(null);
  const aboutHeight = useElementHeight(aboutRef);
  const height = containerHeight
    ? containerHeight - (aboutHeight ? aboutHeight + ABOUT_HEIGHT_OFFSET : 0)
    : undefined;

  const maxItemsPerCategory = height
    ? Math.max(
      Math.floor(height / categoriesCount / APPROXIMATE_ITEM_HEIGHT),
      // Always show at least 2 items
      2,
    )
    : undefined;

  const { photosCountHidden } = useAppState();

  const tagsIncludingHidden = useMemo(() =>
    addPrivateToTags(tags, photosCountHidden)
  , [tags, photosCountHidden]);

  const recentsContent = recents.length > 0
    ? <HeaderList
      key="recents"
      items={[<PhotoRecents
        key="recents"
        hoverCount={recents[0]?.count}
        type="text-only"
        prefetch={false}
        contrast="low"
        badged
      />]}
    />
    : null;

  const yearsContent = years.length > 0
    ? <HeaderList
      key="years"
      title={getCategoryTitle('years', appText)}
      icon={<CategoryIcon category="years" />}
      maxItems={maxItemsPerCategory}
      items={yearRows.map((row, index) =>
        <div key={index} className="flex gap-[5px]">
          {row.map(({ year, count }) =>
            <PhotoYear
              key={year}
              year={year}
              hoverCount={count}
              type="text-only"
              prefetch={false}
              contrast="low"
              hoverType="image"
              suppressSpinner
              badged
            />)}
        </div>)}
    />
    : null;

  const camerasContent = cameras.length > 0
    ? <HeaderList
      key="cameras"
      title={getCategoryTitle('cameras', appText)}
      icon={<CategoryIcon category="cameras" />}
      maxItems={maxItemsPerCategory}
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
      title={getCategoryTitle('lenses', appText)}
      icon={<CategoryIcon category="lenses" />}
      maxItems={maxItemsPerCategory}
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

  const albumsContent = albums.length > 0
    ? <HeaderList
      key="albums"
      title={getCategoryTitle('albums', appText)}
      icon={<CategoryIcon category="albums" />}
      maxItems={maxItemsPerCategory}
      items={albums
        .map(({ album, count }) =>
          <div key={album.slug} className="flex gap-1">
            <PhotoAlbum
              key={album.slug}
              album={album}
              type="text-only"
              prefetch={false}
              contrast="low"
              hoverCount={count}
              badged
            />
          </div>)}
    />
    : null;

  const tagsContent = tags.length > 0
    ? <HeaderList
      key="tags"
      title={getCategoryTitle('tags', appText)}
      icon={<CategoryIcon category="tags" />}
      maxItems={maxItemsPerCategory}
      items={tagsIncludingHidden
        .map(({ tag, count }) => {
          switch (tag) {
            case TAG_FAVS:
              return <PhotoFavs
                key={TAG_FAVS}
                hoverCount={count}
                type="icon-last"
                prefetch={false}
                contrast="low"
                badged
              />;
            case TAG_PRIVATE:
              return <PhotoPrivate
                key={TAG_PRIVATE}
                type="icon-last"
                prefetch={false}
                contrast="low"
                badged
              />;
            default:
              return <PhotoTag
                key={tag}
                tag={tag}
                hoverCount={count}
                type="text-only"
                prefetch={false}
                contrast="low"
                badged
              />;
          }
        })}
    />
    : null;

  const recipesContent = recipes.length > 0
    ? <HeaderList
      key="recipes"
      title={getCategoryTitle('recipes', appText)}
      icon={<CategoryIcon category="recipes" />}
      maxItems={maxItemsPerCategory}
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

  const filmsContent = films.length > 0
    ? <HeaderList
      key="films"
      title={getCategoryTitle('films', appText)}
      icon={<CategoryIcon category="films" />}
      maxItems={maxItemsPerCategory}
      items={films
        .map(({ film, count }) =>
          <PhotoFilm
            key={film}
            film={film}
            hoverCount={count}
            type="text-only"
            prefetch={false}
          />)}
    />
    : null;

  const focalLengthsContent = focalLengths.length > 0
    ? <HeaderList
      key="focal-lengths"
      title={getCategoryTitle('focal-lengths', appText)}
      icon={<CategoryIcon category="focal-lengths" />}
      maxItems={maxItemsPerCategory}
      items={focalLengths.map(({ focal, count }) =>
        <PhotoFocalLength
          key={focal}
          focal={focal}
          hoverCount={count}
          type="text-only"
          prefetch={false}
          badged
        />)}
    />
    : null;

  const photoStatsContent = photosCount > 0
    ? <HeaderList
      key="photo-stats"
      items={[photoQuantityText(photosCount, appText, false)]}
    />
    : null;

  return (
    <div className={clsx('space-y-4', className)}>
      {aboutTextSafelyParsedHtml && <HeaderList
        items={[<p
          key="about"
          ref={aboutRef}
          className={clsx(
            'max-w-60 normal-case text-dim [&>a]:underline',
            aboutTextHasBrParagraphBreaks && 'pb-2',
          )}
          dangerouslySetInnerHTML={{
            __html: aboutTextSafelyParsedHtml,
          }}
        />]}
      />}
      {CATEGORY_VISIBILITY.map(category => {
        switch (category) {
          case 'recents': return recentsContent;
          case 'years': return yearsContent;
          case 'cameras': return camerasContent;
          case 'lenses': return lensesContent;
          case 'albums': return albumsContent;
          case 'tags': return tagsContent;
          case 'recipes': return recipesContent;
          case 'films': return filmsContent;
          case 'focal-lengths': return focalLengthsContent;
        }
      })}
      {photoStatsContent}
    </div>
  );
}
