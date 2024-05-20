import { Photo, PhotoDateRange } from '@/photo';
import FilmSimulationHeader from './FilmSimulationHeader';
import { FilmSimulation } from '.';
import PhotoGridPage from '@/photo/PhotoGridPage';

export default function FilmSimulationOverview({
  simulation,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  simulation: FilmSimulation,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRange,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridPage {...{
      cacheKey: `simulation-${simulation}`, 
      photos,
      count,
      simulation,
      header: <FilmSimulationHeader {...{
        simulation,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
