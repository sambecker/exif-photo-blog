import { Photo, PhotoDateRange } from '@/photo';
import FilmHeader from './FilmHeader';
import { FilmSimulation } from '.';
import PhotoGridContainer from '@/photo/PhotoGridContainer';

export default function FilmOverview({
  film,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  film: FilmSimulation,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRange,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridContainer {...{
      cacheKey: `film-${film}`, 
      photos,
      count,
      film,
      header: <FilmHeader {...{
        film,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
