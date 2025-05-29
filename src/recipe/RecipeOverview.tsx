import { Photo, PhotoDateRange } from '@/photo';
import PhotoGridContainer from '@/photo/PhotoGridContainer';
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
  dateRange?: PhotoDateRange,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridContainer {...{
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
