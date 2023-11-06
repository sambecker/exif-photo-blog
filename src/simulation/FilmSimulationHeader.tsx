import { Photo, PhotoDateRange } from '@/photo';
import { FilmSimulation, descriptionForFilmSimulationPhotos } from '.';
import { pathForFilmSimulationShare } from '@/site/paths';
import PhotoHeader from '@/photo/PhotoHeader';
import AnimateItems from '@/components/AnimateItems';
import PhotoFilmSimulation from
  '@/simulation/PhotoFilmSimulation';

export default function FilmSimulationHeader({
  simulation,
  photos,
  selectedPhoto,
  count,
  dateRange,
}: {
  simulation: FilmSimulation
  photos: Photo[]
  selectedPhoto?: Photo
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <AnimateItems
      type="bottom"
      distanceOffset={10}
      items={[<PhotoHeader
        key="PhotoHeader"
        entity={<PhotoFilmSimulation {...{ simulation }} />}
        entityVerb="Photo"
        entityDescription={descriptionForFilmSimulationPhotos(
          photos, undefined, count, dateRange)}
        photos={photos}
        selectedPhoto={selectedPhoto}
        sharePath={pathForFilmSimulationShare(simulation)}
        count={count}
        dateRange={dateRange}
      />]}
    />
  );
}
