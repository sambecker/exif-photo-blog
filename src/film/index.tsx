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
  deparameterize,
  formatCount,
  formatCountDescriptive,
} from '@/utility/string';
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
  } else {
    const filmFormatted = deparameterize(film);
    return {
      small: filmFormatted,
      medium: filmFormatted,
      large: filmFormatted,
    };
  }
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
  _films: Films = [],
  includeAllFujifilmSimulations?: boolean,
): AnnotatedTag[] => {
  const films: AnnotatedTag[] = includeAllFujifilmSimulations
    ? FUJIFILM_SIMULATION_FORM_INPUT_OPTIONS
      .map(({ value }) => ({ value }))
    : [];

  _films.forEach(({ film, count }) => {
    const index = films.findIndex(f => f.value === film);
    const meta =  {
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
    };
    if (index === -1) {
      films.push({ value: film, ...meta });
    } else {
      films[index] = { ...films[index], ...meta };
    }
  });

  return films
    .map(film => ({
      ...film,
      label: labelForFilm(film.value).large,
      icon: <PhotoFilmIcon film={film.value} />,
    }))
    .sort((a, b) => a.value.localeCompare(b.value));
};
