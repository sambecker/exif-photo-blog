'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { getPhoto } from '@/photo/query';
import { MAX_PHOTO_UPLOAD_SIZE_IN_BYTES } from '@/photo';
import { revalidatePhoto } from '@/photo/cache';
import { fetchUrlWithByteLimit } from '@/utility/fetch';
import { isOmSystemCamera } from './recipe';
import { getOmRecipeFromImage } from './server';
import { storeOmRecipe } from './query';

export type OmRecipeImportResult = {
  photoId: string
  status: 'imported' | 'absent' | 'failed'
  message?: string
};

export const importOmRecipeAction = async (
  photoId: string,
): Promise<OmRecipeImportResult> => runAuthenticatedAdminServerAction(
  async () => {
    try {
      const photo = await getPhoto(photoId, true);
      if (!photo || !isOmSystemCamera(photo.make)) {
        throw new Error('OM SYSTEM or Olympus photo not found');
      }
      // Recipe-only import: no image processing, AI, or storage mutations.
      const bytes = await fetchUrlWithByteLimit(
        photo.url,
        MAX_PHOTO_UPLOAD_SIZE_IN_BYTES,
      );
      const { isOmCamera, recipe } = getOmRecipeFromImage(Buffer.from(bytes));
      await storeOmRecipe(photoId, photo.url, isOmCamera ? recipe : undefined);
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
