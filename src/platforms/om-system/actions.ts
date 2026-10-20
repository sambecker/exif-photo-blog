'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { getPhoto } from '@/photo/query';
import { MAX_PHOTO_UPLOAD_SIZE_IN_BYTES } from '@/photo';
import { revalidatePhoto } from '@/photo/cache';
import { fetchUrlWithByteLimit } from '@/utility/fetch';
import { isOmSystemPen } from './recipe';
import { getOmRecipeFromImage } from './server';
import { storePenRecipe } from './query';

export type PenRecipeImportResult = {
  photoId: string
  status: 'imported' | 'absent' | 'failed'
  message?: string
};

export const importPenRecipeAction = async (
  photoId: string,
): Promise<PenRecipeImportResult> => runAuthenticatedAdminServerAction(
  async () => {
    try {
      const photo = await getPhoto(photoId, true);
      if (!photo || !isOmSystemPen(photo.make, photo.model)) {
        throw new Error('PEN photo not found');
      }
      // Recipe-only import: no image processing, AI, or storage mutations.
      const bytes = await fetchUrlWithByteLimit(
        photo.url,
        MAX_PHOTO_UPLOAD_SIZE_IN_BYTES,
      );
      const { isPen, recipe } = getOmRecipeFromImage(Buffer.from(bytes));
      await storePenRecipe(photoId, photo.url, isPen ? recipe : undefined);
      revalidatePhoto(photoId);
      return { photoId, status: recipe ? 'imported' : 'absent' };
    } catch (error) {
      return {
        photoId,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Import failed',
      };
    }
  },
);
