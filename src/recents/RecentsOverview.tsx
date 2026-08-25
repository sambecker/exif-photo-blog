import { Photo, PhotoDateRangePostgres } from '@/photo';
import RecentsHeader from './RecentsHeader';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';

export default function RecentsOverview({
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridHybridContainer {...{
      cacheKey: 'recents', 
      photos,
      count,
      recent: true,
      header: <RecentsHeader {...{
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
