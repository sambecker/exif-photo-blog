import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import {
  absolutePathForFilmSimulation,
  absolutePathForFilmSimulationImage,
} from '@/app/paths';
import {
  FujifilmSimulation,
  labelForFilm,
} from '@/platforms/fujifilm/simulation';

export type FilmSimulation = FujifilmSimulation;

export type FilmSimulationWithCount = {
  film: FilmSimulation
  count: number
}

export type FilmSimulations = FilmSimulationWithCount[]

export const sortFilms = (
  films: FilmSimulations,
) => films.sort(sortFilmsWithCount);

export const sortFilmsWithCount = (
  a: FilmSimulationWithCount,
  b: FilmSimulationWithCount,
) => {
  const aLabel = labelForFilm(a.film).large;
  const bLabel = labelForFilm(b.film).large;
  return aLabel.localeCompare(bLabel);
};

export const titleForFilmSimulation = (
  film: FilmSimulation,
  photos: Photo[],
  explicitCount?: number,
) => [
  labelForFilm(film).large,
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const shareTextForFilmSimulation = (
  film: FilmSimulation,
) =>
  `Photos shot on Fujifilm ${labelForFilm(film).large}`;

export const descriptionForFilmSimulationPhotos = (
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

export const generateMetaForFilmSimulation = (
  film: FilmSimulation,
  photos: Photo[],
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForFilmSimulation(film),
  title: titleForFilmSimulation(film, photos, explicitCount),
  description: descriptionForFilmSimulationPhotos(
    photos,
    true,
    explicitCount,
    explicitDateRange,
  ),
  images: absolutePathForFilmSimulationImage(film),
});

export const photoHasFilmSimulationData = (photo: Photo) =>
  Boolean(photo.filmSimulation);
