import { Photo, PhotoDateRangePostgres } from '@/photo';
import FilmHeader from './FilmHeader';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';

export default function FilmOverview({
  film,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  film: string,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridHybridContainer {...{
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
