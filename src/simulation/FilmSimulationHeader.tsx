import { Photo, PhotoDateRange } from '@/photo';
import { FilmSimulation, descriptionForFilmSimulationPhotos } from '.';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoFilmSimulation from
  '@/simulation/PhotoFilmSimulation';

export default function FilmSimulationHeader({
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
      simulation={simulation}
      entity={<PhotoFilmSimulation {...{ simulation }} />}
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
