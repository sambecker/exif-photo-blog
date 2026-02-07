import {
  Photo,
  PhotoDateRangePostgres,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import {
  absolutePathForFilm,
  absolutePathForFilmImage,
} from '@/app/path';
import {
  FUJIFILM_SIMULATION_FORM_INPUT_OPTIONS,
  labelForFujifilmSimulation,
} from '@/platforms/fujifilm/simulation';
import {
  isStringNikonPictureControl,
  labelForNikonPictureControl,
} from '@/platforms/nikon/simulation';
import { deparameterize } from '@/utility/string';
import { AnnotatedTag } from '@/photo/form';
import PhotoFilmIcon from './PhotoFilmIcon';
import { AppTextState } from '@/i18n/state';
import { CategoryQueryMeta } from '@/category';

export type FilmWithMeta = { film: string } & CategoryQueryMeta

export type Films = FilmWithMeta[]

export const labelForFilm = (film: string) => {
  // Use Fujifilm simulation text when recognized
  const simulationLabel = labelForFujifilmSimulation(film as any);
  if (simulationLabel) {
    return simulationLabel;
  }

  // Use Nikon Picture Control text when recognized
  if (isStringNikonPictureControl(film)) {
    return labelForNikonPictureControl(film);
  }

  const filmFormatted = deparameterize(film);
  return {
    small: filmFormatted,
    medium: filmFormatted,
    large: filmFormatted,
  };
};

export const sortFilms = (
  films: Films,
) => films.sort(sortFilmsWithCount);

export const sortFilmsWithCount = (
  a: FilmWithMeta,
  b: FilmWithMeta,
) => {
  const aLabel = labelForFilm(a.film).large;
  const bLabel = labelForFilm(b.film).large;
  return aLabel.localeCompare(bLabel);
};

export const titleForFilm = (
  film: string,
  photos: Photo[],
  appText: AppTextState,
  explicitCount?: number,
) => [
  labelForFilm(film).large,
  photoQuantityText(explicitCount ?? photos.length, appText),
].join(' ');

export const shareTextForFilm = (
  film: string,
  appText: AppTextState,
) =>
  appText.category.filmShare(labelForFilm(film).large);

export const descriptionForFilmPhotos = (
  photos: Photo[],
  appText: AppTextState,
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRangePostgres,
) =>
  descriptionForPhotoSet(
    photos,
    appText,
    undefined,
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForFilm = (
  film: string,
  photos: Photo[],
  appText: AppTextState,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRangePostgres,
) => ({
  url: absolutePathForFilm(film),
  title: titleForFilm(film, photos, appText, explicitCount),
  description: descriptionForFilmPhotos(
    photos,
    appText,
    true,
    explicitCount,
    explicitDateRange,
  ),
  images: absolutePathForFilmImage(film),
});

export const photoHasFilmData = (photo: Photo) =>
  Boolean(photo.film);

export const convertFilmsForForm = (
  films: Films = [],
  includeAllFujifilmSimulations?: boolean,
  currentFilm?: string,
  make?: string,
): AnnotatedTag[] => {
  const filmOptions: AnnotatedTag[] = [];

  if (currentFilm && !films.some(f => f.film === currentFilm)) {
    films.push({ film: currentFilm } as FilmWithMeta);
  }

  films.forEach(item => {
    filmOptions.push({
      value: item.film,
      label: labelForFilm(item.film).large,
      icon: <PhotoFilmIcon film={item.film} make={make} />,
    });
  });

  if (includeAllFujifilmSimulations) {
    FUJIFILM_SIMULATION_FORM_INPUT_OPTIONS.forEach(({ value: simulation }) => {
      if (!filmOptions.some(option => option.value === simulation)) {
        filmOptions.push({
          value: simulation,
          label: labelForFilm(simulation).large,
          icon: <PhotoFilmIcon film={simulation} make={make} />,
        });
      }
    });
  }

  return filmOptions.sort((a, b) => a.value.localeCompare(b.value));
};
