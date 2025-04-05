import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import {
  absolutePathForFilm,
  absolutePathForFilmImage,
} from '@/app/paths';
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

export type FilmWithCount = {
  film: string
  count: number
}

export type Films = FilmWithCount[]

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
  a: FilmWithCount,
  b: FilmWithCount,
) => {
  const aLabel = labelForFilm(a.film).large;
  const bLabel = labelForFilm(b.film).large;
  return aLabel.localeCompare(bLabel);
};

export const titleForFilm = (
  film: string,
  photos: Photo[],
  explicitCount?: number,
) => [
  labelForFilm(film).large,
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const shareTextForFilm = (
  film: string,
) =>
  `Photos shot on ${labelForFilm(film).large}`;

export const descriptionForFilmPhotos = (
  photos: Photo[],
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) =>
  descriptionForPhotoSet(
    photos,
    undefined,
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForFilm = (
  film: string,
  photos: Photo[],
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForFilm(film),
  title: titleForFilm(film, photos, explicitCount),
  description: descriptionForFilmPhotos(
    photos,
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
