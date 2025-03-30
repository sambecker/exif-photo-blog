import { Photo, PhotoDateRange } from '@/photo';
import { FilmSimulation, descriptionForFilmSimulationPhotos } from '.';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoFilm from '@/film/PhotoFilm';

export default function FilmHeader({
  simulation,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  simulation: FilmSimulation
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <PhotoHeader
      film={simulation}
      entity={<PhotoFilm {...{ simulation }} />}
      entityDescription={descriptionForFilmSimulationPhotos(
        photos, undefined, count, dateRange)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      includeShareButton
    />
  );
}
