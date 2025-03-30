import { Photo, PhotoDateRange } from '@/photo';
import FilmHeader from './FilmHeader';
import { FilmSimulation } from '.';
import PhotoGridContainer from '@/photo/PhotoGridContainer';

export default function FilmOverview({
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
    <PhotoGridContainer {...{
      cacheKey: `simulation-${simulation}`, 
      photos,
      count,
      simulation,
      header: <FilmHeader {...{
        simulation,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
