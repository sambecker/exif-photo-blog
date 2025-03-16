'use client';

import { Cameras, sortCamerasWithCount } from '@/camera';
import PhotoCamera from '@/camera/PhotoCamera';
import HeaderList from '@/components/HeaderList';
import PhotoTag from '@/tag/PhotoTag';
import { PhotoDateRange, dateRangeForPhotos, photoQuantityText } from '.';
import { TAG_FAVS, TAG_HIDDEN, Tags, addHiddenToTags } from '@/tag';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import { FilmSimulations, sortFilmSimulationsWithCount } from '@/simulation';
import FavsTag from '../tag/FavsTag';
import { useAppState } from '@/state/AppState';
import { useMemo } from 'react';
import HiddenTag from '@/tag/HiddenTag';
import { CATEGORY_VISIBILITY, SITE_ABOUT } from '@/app/config';
import {
  htmlHasBrParagraphBreaks,
  safelyParseFormattedHtml,
} from '@/utility/html';
import { clsx } from 'clsx/lite';
import { Recipes, sortRecipesWithCount } from '@/recipe';
import PhotoRecipe from '@/recipe/PhotoRecipe';
import IconCamera from '@/components/icons/IconCamera';
import IconRecipe from '@/components/icons/IconRecipe';
import IconTag from '@/components/icons/IconTag';
import IconFilmSimulation from '@/components/icons/IconFilmSimulation';
import IconLens from '@/components/icons/IconLens';
import { Lenses, sortLensesWithCount } from '@/lens';
import PhotoLens from '@/lens/PhotoLens';

export default function PhotoGridSidebar({
  cameras,
  lenses,
  tags,
  simulations,
  recipes,
  photosCount,
  photosDateRange,
}: {
  tags: Tags
  lenses: Lenses
  cameras: Cameras
  simulations: FilmSimulations
  recipes: Recipes
  photosCount: number
  photosDateRange?: PhotoDateRange
}) {
  const { start, end } = dateRangeForPhotos(undefined, photosDateRange);

  const { photosCountHidden } = useAppState();

  const tagsIncludingHidden = useMemo(() =>
    addHiddenToTags(tags, photosCountHidden)
  , [tags, photosCountHidden]);

  const camerasContent = cameras.length > 0
    ? <HeaderList
      key="cameras"
      title="Cameras"
      icon={<IconCamera size={15} />}
      items={cameras
        .sort(sortCamerasWithCount)
        .map(({ cameraKey, camera, count }) =>
          <PhotoCamera
            key={cameraKey}
            camera={camera}
            type="text-only"
            countOnHover={count}
            prefetch={false}
            contrast="low"
            hideAppleIcon
            badged
          />)}
    />
    : null;

  const lensesContent = lenses.length > 0
    ? <HeaderList
      key="lenses"
      title="Lenses"
      icon={<IconLens size={15} />}
      items={lenses
        .sort(sortLensesWithCount)
        .map(({ lensKey, lens, count }) =>
          <PhotoLens
            key={lensKey}
            lens={lens}
            type="text-only"
            countOnHover={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
    />
    : null;

  const tagsContent = tags.length > 0
    ? <HeaderList
      key="tags"
      title='Tags'
      icon={<IconTag
        size={14}
        className="translate-y-[1px]"
      />}
      items={tagsIncludingHidden.map(({ tag, count }) => {
        switch (tag) {
        case TAG_FAVS:
          return <FavsTag
            key={TAG_FAVS}
            countOnHover={count}
            type="icon-last"
            prefetch={false}
            contrast="low"
            badged
          />;
        case TAG_HIDDEN:
          return <HiddenTag
            key={TAG_HIDDEN}
            countOnHover={count}
            type="icon-last"
            prefetch={false}
            contrast="low"
            badged
          />;
        default:
          return <PhotoTag
            key={tag}
            tag={tag}
            type="text-only"
            countOnHover={count}
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
      title="Recipes"
      icon={<IconRecipe
        size={16}
        className="translate-x-[-1px]"
      />}
      items={sortRecipesWithCount(recipes)
        .map(({ recipe, count }) =>
          <PhotoRecipe
            key={recipe}
            recipe={recipe}
            type="text-only"
            countOnHover={count}
            prefetch={false}
            contrast="low"
            badged
          />)}
    />
    : null;

  const filmsContent = simulations.length > 0
    ? <HeaderList
      key="films"
      title="Films"
      icon={<IconFilmSimulation size={15} />}
      items={simulations
        .sort(sortFilmSimulationsWithCount)
        .map(({ simulation, count }) =>
          <PhotoFilmSimulation
            key={simulation}
            simulation={simulation}
            countOnHover={count}
            type="text-only"
            prefetch={false}
          />)}
    />
    : null;

  const photoStatsContent = photosCount > 0
    ? start
      ? <HeaderList
        key="photo-stats"
        title={photoQuantityText(photosCount, false)}
        items={start === end
          ? [start]
          : [`${end} –`, start]}
      />
      : <HeaderList
        key="photo-stats"
        items={[photoQuantityText(photosCount, false)]}
      />
    : null;

  return (
    <div className="space-y-4">
      {SITE_ABOUT && <HeaderList
        items={[<p
          key="about"
          className={clsx(
            'max-w-60 normal-case text-main',
            htmlHasBrParagraphBreaks(SITE_ABOUT) && 'pb-2',
          )}
          dangerouslySetInnerHTML={{
            __html: safelyParseFormattedHtml(SITE_ABOUT),
          }}
        />]}
      />}
      {CATEGORY_VISIBILITY.map(category => {
        switch (category) {
        case 'tags': return tagsContent;
        case 'cameras': return camerasContent;
        case 'lenses': return lensesContent;
        case 'recipes': return recipesContent;
        case 'films': return filmsContent;
        }
      })}
      {photoStatsContent}
    </div>
  );
}
