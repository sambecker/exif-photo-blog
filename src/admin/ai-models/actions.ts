'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { ADMIN_AI_MODEL_DEBUG_ENABLED, IS_PREVIEW } from '@/app/config';
import { getPhoto } from '@/photo/query';
import { resizeImageFromUrl } from '@/photo/server';
import { getOptimizedPhotoUrlForManipulation } from '@/photo/storage';
import { getAiImageQuerySchema } from '@/photo/ai';
import { generateOpenAiImageObjectQueryForModel } from '@/platforms/openai';
import { OpenAIModel } from '@/platforms/openai/models';
import { AiModelResult } from '.';

// Returns results in the same order as `models`, which may
// contain duplicates when a fixed and custom column overlap
export const generateAiTextForModelsAction = async (
  photoId: string,
  models: OpenAIModel[],
): Promise<AiModelResult[]> =>
  runAuthenticatedAdminServerAction(async () => {
    if (!ADMIN_AI_MODEL_DEBUG_ENABLED) {
      throw new Error('AI model debugging not enabled');
    }

    const photo = await getPhoto(photoId, true);

    if (!photo) { throw new Error('Photo not found'); }

    const imageBase64 = await resizeImageFromUrl(
      getOptimizedPhotoUrlForManipulation(photo.url, IS_PREVIEW),
    );

    if (!imageBase64) { throw new Error('Could not resize photo'); }

    const { query, schema } = getAiImageQuerySchema(['title', 'caption']);

    return Promise.all(models.map(async model => {
      const timeStart = Date.now();
      try {
        // Schema is built dynamically, so fields aren't statically inferred
        const { title, caption }: {
          title?: string
          caption?: string
        } = await generateOpenAiImageObjectQueryForModel(
          imageBase64,
          query,
          schema,
          model,
        );
        return { model, title, caption, durationInMs: Date.now() - timeStart };
      } catch (e: any) {
        return {
          model,
          error: e.message ?? 'Unknown error',
          durationInMs: Date.now() - timeStart,
        };
      }
    }));
  });
