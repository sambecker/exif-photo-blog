import { Photo, PhotoDateRange } from '@/photo';
import SiteGrid from '@/components/SiteGrid';
import AnimateItems from '@/components/AnimateItems';
import PhotoGrid from '@/photo/PhotoGrid';
import FilmSimulationHeader from './FilmSimulationHeader';
import { FilmSimulation } from '.';

export default function FilmSimulationOverview({
  simulation,
  photos,
  count,
  dateRange,
  showMorePath,
  animateOnFirstLoadOnly,
}: {
  simulation: FilmSimulation,
  photos: Photo[],
  count: number,
  dateRange: PhotoDateRange,
  showMorePath?: string,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <SiteGrid
      contentMain={<div className="space-y-8 mt-4">
        <AnimateItems
          type="bottom"
          items={[
            <FilmSimulationHeader
              key="FilmSimulationHeader"
              {...{ simulation, photos, count, dateRange }}
            />,
          ]}
          animateOnFirstLoadOnly
        />
        <PhotoGrid
          {...{ photos, simulation, showMorePath, animateOnFirstLoadOnly }}
        />
      </div>}
    />
  );
}
