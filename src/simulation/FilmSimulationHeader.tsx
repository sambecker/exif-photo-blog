import { Photo, PhotoDateRange } from '@/photo';
import { FilmSimulation, descriptionForFilmSimulationPhotos } from '.';
import { pathForFilmSimulationShare } from '@/site/paths';
import PhotoSetHeader from '@/photo/PhotoSetHeader';
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
    <PhotoSetHeader
      entity={<PhotoFilmSimulation {...{ simulation }} />}
      entityVerb="Photo"
      entityDescription={descriptionForFilmSimulationPhotos(
        photos, undefined, count, dateRange)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForFilmSimulationShare(simulation)}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
    />
  );
}
