import { Photo, PhotoDateRangePostgres } from '@/photo';
import QueryHeader from './QueryHeader';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';

export default function QueryOverview({
  query,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  query: string,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridHybridContainer {...{
      cacheKey: `query-${query}`,
      photos,
      count,
      query,
      header: <QueryHeader {...{
        query,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
