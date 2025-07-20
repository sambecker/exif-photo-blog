import { Photo, PhotoDateRange } from '@/photo';
import YearHeader from './YearHeader';
import PhotoGridContainer from '@/photo/PhotoGridContainer';

export default function YearOverview({
  year,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  year: string,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRange,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridContainer {...{
      cacheKey: `year-${year}`, 
      photos,
      count,
      year,
      header: <YearHeader {...{
        year,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
} 