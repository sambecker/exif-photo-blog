import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';
import RecipeHeader from './RecipeHeader';

export default function RecipeOverview({
  recipe,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  recipe: string,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridHybridContainer {...{
      cacheKey: `recipe-${recipe}`,
      photos,
      count,
      recipe,
      header: <RecipeHeader {...{
        recipe,
        photos,
        count,
        dateRange,
      }} />,
      animateOnFirstLoadOnly,
    }} />
  );
}
