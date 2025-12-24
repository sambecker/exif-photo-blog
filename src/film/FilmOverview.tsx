import { Photo, PhotoDateRangePostgres } from '@/photo';
import FilmHeader from './FilmHeader';
import PhotoGridContainer from '@/photo/PhotoGridContainer';

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
  const decodedFilm = decodeURIComponent(film);
  return (
    <PhotoGridContainer {...{
      cacheKey: `film-${film}`, 
      photos,
      count,
      film: decodedFilm,
      header: <FilmHeader {...{
        film: decodedFilm,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
