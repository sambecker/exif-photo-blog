import { Photo, PhotoDateRangePostgres } from '@/photo';
import RecentsHeader from './RecentsHeader';
import PhotoGridContainer from '@/photo/PhotoGridContainer';

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
    <PhotoGridContainer {...{
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
