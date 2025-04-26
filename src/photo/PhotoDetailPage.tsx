import AnimateItems from '@/components/AnimateItems';
import { Photo, PhotoDateRange } from '.';
import { PhotoSetCategory } from '../category';
import PhotoLarge from './PhotoLarge';
import AppGrid from '@/components/AppGrid';
import PhotoGrid from './PhotoGrid';
import TagHeader from '@/tag/TagHeader';
import CameraHeader from '@/camera/CameraHeader';
import FilmHeader from '@/film/FilmHeader';
import { TAG_HIDDEN } from '@/tag';
import HiddenHeader from '@/tag/HiddenHeader';
import FocalLengthHeader from '@/focal/FocalLengthHeader';
import PhotoHeader from './PhotoHeader';
import RecipeHeader from '@/recipe/RecipeHeader';
import { ReactNode } from 'react';
import LensHeader from '@/lens/LensHeader';

export default function PhotoDetailPage({
  photo,
  photos,
  photosGrid,
  tag,
  camera,
  lens,
  film,
  recipe,
  focal,
  indexNumber,
  count,
  dateRange,
  shouldShare,
  includeFavoriteInAdminMenu,
}: {
  photo: Photo
  photos: Photo[]
  photosGrid?: Photo[]
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
  shouldShare?: boolean
  includeFavoriteInAdminMenu?: boolean
} & PhotoSetCategory) {
  let customHeader: ReactNode | undefined;

  if (tag) {
    customHeader = tag === TAG_HIDDEN
      ? <HiddenHeader
        photos={photos}
        selectedPhoto={photo}
        indexNumber={indexNumber}
        count={count ?? 0}
      />
      : <TagHeader
        key={tag}
        tag={tag}
        photos={photos}
        selectedPhoto={photo}
        indexNumber={indexNumber}
        count={count}
        dateRange={dateRange}
      />;
  } else if (camera) {
    customHeader = <CameraHeader
      camera={camera}
      photos={photos}
      selectedPhoto={photo}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
    />;
  } else if (lens) {
    customHeader = <LensHeader
      lens={lens}
      photos={photos}
      selectedPhoto={photo}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
    />;
  } else if (film) {
    customHeader = <FilmHeader
      film={film}
      photos={photos}
      selectedPhoto={photo}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
    />;
  } else if (recipe) {
    customHeader = <RecipeHeader
      recipe={recipe}
      photos={photos}
      selectedPhoto={photo}
      indexNumber={indexNumber}
      count={count}
    />;
  } else if (focal) {
    customHeader = <FocalLengthHeader
      focal={focal}
      photos={photos}
      selectedPhoto={photo}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
    />;
  }

  return (
    <div>
      <AppGrid
        className="mt-1.5 mb-6"
        contentMain={customHeader ?? <PhotoHeader
          selectedPhoto={photo}
          photos={photos}
          recipe={recipe}
        />}
      />
      <AnimateItems
        className="md:mb-8"
        animateFromAppState
        items={[
          <PhotoLarge
            key={photo.id}
            photo={photo}
            primaryTag={tag}
            priority
            prefetchRelatedLinks
            showTitle={Boolean(customHeader)}
            showTitleAsH1
            showCamera={!camera}
            showLens={!lens}
            showFilm={!film}
            showRecipe={!recipe}
            shouldShare={shouldShare}
            shouldShareCamera={camera !== undefined}
            shouldShareLens={lens !== undefined}
            shouldShareTag={tag !== undefined}
            shouldShareFilm={film !== undefined}
            shouldShareRecipe={recipe !== undefined}
            shouldShareFocalLength={focal !== undefined}
            includeFavoriteInAdminMenu={includeFavoriteInAdminMenu}
            showAdminKeyCommands
          />,
        ]}
      />
      <AppGrid
        sideFirstOnMobile
        contentMain={<PhotoGrid
          photos={photosGrid ?? photos}
          selectedPhoto={photo}
          tag={tag}
          camera={camera}
          film={film}
          focal={focal}
          animateOnFirstLoadOnly
        />}
      />
    </div>
  );
}
