import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import RecipeImageResponse from '@/recipe/RecipeImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET(
  _: Request,
  context: { params: Promise<{ recipe: string }> },
) {
  const { recipe } = await context.params;

  return cachedOgPhotoResponse(
    { recipe },
    { recipe, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <RecipeImageResponse {...{ recipe, ...args }} />,
  );
}
